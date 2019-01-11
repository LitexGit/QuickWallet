
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

const DEFAULT_URI = 'https://www.baidu.com';

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
      this.passphrase = '';
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
    this.passphrase = passphrase;
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
    console.log('======ZJ====RN_onMessage==========================');
    console.log(JSON.parse(evt.nativeEvent.data));
    console.log('======ZJ====RN_onMessage==========================');
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
        const passphrase = '11111111';
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
        const passphrase = '11111111';
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

    const uri = DEFAULT_URI;
    const {isShowPassphrase, isShowSignTx, isShowSignMsg} = this.state;
    const {loading} = this.props;
    const signInfo = {to:'0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db', balance:'100', gas:'10'};
    const {to, balance, gas} = signInfo;


    return (
        <View style={styles.container}>
            <SignTxResultAlert
                isInit={isShowSignTx}
                to={to}
                balance={balance}
                gas={gas}
                onPressCancel={()=>this._signTxCancel()}
                onPressConfirm={()=>this._signTxConfirm()}/>
            <PassphraseInputAlert
                isInit={isShowPassphrase}
                onPressCancel={()=>this._pswdCancel()}
                onPressConfirm={(passphrase)=>this._pswdConfirm(passphrase)}/>
            <SignMsgResultAlert
                isInit={isShowSignMsg}
                onPressCancel={()=>this._signMsgCancel()}
                onPressConfirm={()=>this._signMsgConfirm()}/>
            <Spinner visible={loading} cancelable
                textContent={'Loading...'}
                textStyle={styles.spinnerText}/>
            <WebView useWebKit
                ref ={ref=>this.webview = ref}
                onMessage={this._onMessage}
                style={styles.container}
                // injectedJavaScript={injectScript}
                source={require('./index.html')}/>
        </View>);
}
}

const mapStateToProps = (state) => {
    const {
        wallet:{ loading }
    } = state;
    return { loading };
};

const mapDispatchToProps = (dispatch) => ({
    gethIsUnlockAccount: () => dispatch(WalletActions.gethIsUnlockAccount()),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer2WebScreen);

