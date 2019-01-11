
import React, { Component } from 'react';
import { Share, Platform, View, WebView} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/Layer2WebScreenStyle';
import RightComponent from '../Components/RightComponent';
import PassphraseInputAlert from '../Components/PassphraseInputAlert';
import SignTxResultAlert from '../Components/SignTxResultAlert';
import SignMsgResultAlert from '../Components/SignMsgResultAlert';
import WalletActions from '../Redux/WalletRedux';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import Spinner from 'react-native-loading-spinner-overlay';
import GethModule from '../Lib/NativeBridge/WalletUtils';
import Toast from 'react-native-root-toast';
import {getDisplayTxInfo} from '../Lib/Format';
import I18n from '../I18n';
import Config from 'react-native-config';
import {layer1} from '../Resources/inject';

// const DEFAULT_URI = 'https://www.baidu.com';
class Layer2WebScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
      title:'Layer2',
      headerRight: (
          <RightComponent
              onPressRefresh={navigation.getParam('onPressRefresh')}
              onPressShare={navigation.getParam('onPressShare')}/>),
  });

  constructor(props){
      super(props);
      this.state={
          isShowPassphrase:false,
          isShowSignTx:false,
          isShowSignMsg:false,
      };
      this.signInfo = {};
  }

  componentDidMount() {
      this.props.navigation.setParams({ onPressRefresh: this._onPressRefresh });
      this.props.navigation.setParams({ onPressShare: this._onPressShare });

      this.isUnlockListener = EventEmitter.addListener(EventKeys.IS_UNLOCK_ACCOUNT, ({isUnlock})=>{
          if (isUnlock) {
              this._signInfo();
              return;
          }
          this.setState({
              isShowPassphrase:true,
          });
      });
      this.lockListener = EventEmitter.addListener(EventKeys.WALLET_UNLOCKED, ()=>this._signInfo());
  }

componentWillUnmount=()=>{
    this.lockListener.remove();
    this.isUnlockListener.remove();
}

_signTxCancel=()=>{
    this.setState({
        isShowSignTx:false,
    });
}

_signTxConfirm=()=>{
    this.setState({
        isShowSignTx:false,
    });
    this.props.gethIsUnlockAccount();
}

_signMsgCancel=()=>{
    this.setState({
        isShowSignMsg:false,
    });
}

_signMsgConfirm=()=>{
    this.setState({
        isShowSignMsg:false,
    });
    this.props.gethIsUnlockAccount();
}

_pswdCancel=()=>{
    this.setState({
        isShowPassphrase:false,
    });
}

_pswdConfirm=(passphrase)=>{
    this.setState({
        isShowPassphrase:false,
    });
    this.props.gethUnlockAccount({passphrase});
}

_onPressRefresh=()=>{
    this.webview.reload();
}

_onPressShare=()=> {
    const shareUrl = 'http://litex.io/';
    const {sharecode} = this.props;
    let shareParams = {};
    if (Platform.OS === 'ios') {
        const url =  shareUrl + '?sharecode=' + sharecode;
        shareParams = {url};
    } else {
        const message = shareUrl + '?sharecode=' + sharecode;
        shareParams = {message};
    }
    Share.share(shareParams);
};


_onMessage=(evt)=>{
    const {isLoginInfo} = this.props;
    if (!isLoginInfo) {
        Toast.show(I18n.t('UnLoginRemind'), {
            shadow:true,
            position: Toast.positions.CENTER,
        });
        return;
    }

    // console.log('======ZJ====RN_onMessage==========================');
    // console.log(JSON.parse(evt.nativeEvent.data));
    // console.log('======ZJ====RN_onMessage==========================');

    const params = JSON.parse(evt.nativeEvent.data);
    this.signInfo = params;
    const {name} = params;
    switch (name) {
    case 'signTransaction':
        this.setState({isShowSignTx:true});
        break;
    case 'signMessage':
        this.setState({isShowSignMsg:true});
        break;

    default:
        break;
    }
}

_signInfo=()=>{
    const {name, id=8888, object={}} = this.signInfo;
    switch (name) {
    case 'signTransaction':{
        const signInfo = getDisplayTxInfo(object);
        this._signTransaction({signInfo, id});
    }
        break;
    case 'signMessage': {
        const {data=''} = object;
        this._signMessage({data, id});
    }
        break;

    default:
        break;
    }
}

_signTransaction=async({signInfo, id=8888})=>{
    try {
        const {passphrase=''} = this.props;
        const signHash = await GethModule.signTransaction({passphrase, signInfo});
        const signMsg = { id, error: null, value: signHash };
        this.webview.postMessage(JSON.stringify(signMsg));
    } catch (error) {
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}


_signMessage = async ({data:message='', id=8888})=>{
    try {
        const {passphrase=''} = this.props;
        const signHash = await GethModule.signMessage({passphrase, message});
        const signMsg = { id, error: null, value: signHash };
        this.webview.postMessage(JSON.stringify(signMsg));
    } catch (error) {
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}


render  () {
    // const uri = DEFAULT_URI;
    const {isShowPassphrase, isShowSignTx, isShowSignMsg} = this.state;
    const {loading, web3Provider, address} = this.props;

    // console.log('===========Config=========================');
    // console.log(address);
    // console.log(Config.CHAIN_ID);
    // console.log(Config.RPC_URL);
    // console.log('===========Config=========================');

    const sprintf = require('sprintf-js').sprintf;
    const signer = sprintf(layer1, address, Config.RPC_URL, Config.CHAIN_ID);
    const injectScript = web3Provider + '' + signer;

    const {object={}} = this.signInfo;
    const {data=''} = object;
    const signInfo = getDisplayTxInfo(object);
    const {to='', value='', gasPrice=''} = signInfo;

    return (
        <View style={styles.container}>
            <SignTxResultAlert
                isInit={isShowSignTx}
                isWallet={false}
                to={to}
                balance={value}
                gas={gasPrice}
                onPressCancel={()=>this._signTxCancel()}
                onPressConfirm={()=>this._signTxConfirm()}/>
            <SignMsgResultAlert
                isInit={isShowSignMsg}
                message={data}
                onPressCancel={()=>this._signMsgCancel()}
                onPressConfirm={()=>this._signMsgConfirm()}/>
            <PassphraseInputAlert
                isInit={isShowPassphrase}
                onPressCancel={()=>this._pswdCancel()}
                onPressConfirm={(passphrase)=>this._pswdConfirm(passphrase)}/>
            <Spinner visible={loading} cancelable
                textContent={'Loading...'}
                textStyle={styles.spinnerText}/>
            <WebView useWebKit
                ref ={ref=>this.webview = ref}
                onMessage={this._onMessage}
                style={styles.container}
                injectedJavaScript={injectScript}
                source={require('./index.html')}/>
        </View>);
}
}

const mapStateToProps = (state) => {
    const {
        user:{web3Provider, passphrase, isLoginInfo, address},
        wallet:{ loading }
    } = state;
    return { loading, web3Provider, passphrase, isLoginInfo, address};
};

const mapDispatchToProps = (dispatch) => ({
    gethIsUnlockAccount: () => dispatch(WalletActions.gethIsUnlockAccount()),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer2WebScreen);

