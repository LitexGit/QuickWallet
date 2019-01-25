
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
import HeaderLeftComponent from '../Components/HeaderLeftComponent';
import { StackActions } from 'react-navigation';

// https://stackoverrun.com/cn/q/12932611

class Layer2WebScreen extends Component {
  static navigationOptions = ({ navigation }) => {
      const { title=''} = navigation.state.params;

      return {
          title,
          headerRight: (
              <RightComponent
                  onPressRefresh={navigation.getParam('onPressRefresh')}
                  onPressShare={navigation.getParam('onPressShare')}/>),
          headerLeft:(
              <HeaderLeftComponent onPress={navigation.getParam('goBack')}/>
          )
      };

  };

  constructor(props){
      super(props);
      this.state={
          isShowPassphrase:false,
          isShowSignTx:false,
          isShowSignMsg:false,
          goBackEnabled:false,
      };
      this.signInfo = {};
      this.passphrase='';
  }

  componentDidMount() {
      this.props.navigation.setParams({ onPressRefresh: this._onPressRefresh });
      this.props.navigation.setParams({ onPressShare: this._onPressShare });
      this.props.navigation.setParams({ goBack: this._goBack });

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

_goBack=()=>{
    const {goBackEnabled=false} = this.state;
    if (goBackEnabled) {
        this.webview.goBack();
        return;
    }
    this.props.pop();
}

_onPressRefresh=()=>{
    this.webview.reload();
}

_onPressShare=()=> {
    const {url} = this.props.navigation.state.params;
    const {sharecode} = this.props;
    let shareParams = {};
    if (Platform.OS === 'ios') {
        const shareUrl = url + '?sharecode=' + sharecode;
        const message = '待分享的信息';
        shareParams = {shareUrl, message};
    } else {
        const shareUrl = 'android 分享的 Url';
        const message = url + '?sharecode=' + sharecode;
        shareParams = {shareUrl,message};
    }
    Share.share(shareParams);
};

_onNavigationStateChange=(navState)=>{
    this.setState({
        goBackEnabled:navState.canGoBack,
    });
}

// passphrase
_pswdCancel=()=>{
    this.setState({
        isShowPassphrase:false,
    });
}

_pswdConfirm=(passphrase)=>{
    this.passphrase = passphrase;
    this.setState({
        isShowPassphrase:false,
    });
    const {name} = this.signInfo;
    switch (name) {
    case 'signTransaction':
        this._signInfo();
        break;
    case 'signMessage':
    case 'signPersonalMessage':
        this.props.gethUnlockAccount({passphrase});
        break;

    default:
        break;
    }

}

// signTxAlert
_signTxCancel=()=>{
    this.setState({
        isShowSignTx:false,
    });
}

_signTxConfirm=()=>{
    this.setState({
        isShowSignTx:false,
        isShowPassphrase:true,
    });
}


// signMsgAlert
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

_onMessage=(evt)=>{

  console.log('==========JSON.parse(evt.nativeEvent.data)==========================');
  console.log(JSON.parse(evt.nativeEvent.data));
  console.log('=========JSON.parse(evt.nativeEvent.data)===========================');

    // const {isLoginInfo} = this.props;
    // if (!isLoginInfo) {
    //     Toast.show(I18n.t('UnLoginRemind'), {
    //         shadow:true,
    //         position: Toast.positions.CENTER,
    //     });
    //     return;
    // }

    const params = JSON.parse(evt.nativeEvent.data);
    this.signInfo = params;
    const {name} = params;
    switch (name) {

    case 'signMessage':
    case 'signPersonalMessage':
        this.setState({isShowSignMsg:true});
        break;
    case 'signTransaction':
    this.setState({isShowSignTx:true});
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
    case 'signMessage':
    case 'signPersonalMessage': {
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
        const signHash = await GethModule.signTransaction({passphrase:this.passphrase, signInfo});
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
        const {address} = this.props;
        const signHash = await GethModule.signMessage({address, message});

        console.log('=========signHash===========================');
        console.log(signHash);
        console.log('=========signHash===========================');

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
    const {isShowPassphrase, isShowSignTx, isShowSignMsg} = this.state;
    const {loading, web3Provider, address} = this.props;

    const {url} = this.props.navigation.state.params;

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
            <WebView
                useWebKit={true}
                ref ={ref=>this.webview = ref}
                style={styles.container}
                onNavigationStateChange={this._onNavigationStateChange}
                allowUniversalAccessFromFileURLs={true}
                allowFileAccess={true}
                onMessage={this._onMessage}
                injectedJavaScript={injectScript}
                // source={require('./index.html')}
                source={{uri:'https://test.eth4.fun/test/examples/'}}
                />
        </View>);
}
}
// mixedContentMode='always'
// renderLoading
// startInLoadingState
// onError
//

const mapStateToProps = (state) => {
    const {
        user:{web3Provider, isLoginInfo, address},
        wallet:{ loading }
    } = state;
    return { loading, web3Provider, isLoginInfo, address};
};

const mapDispatchToProps = (dispatch) => ({
    gethIsUnlockAccount: () => dispatch(WalletActions.gethIsUnlockAccount()),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
    pop:() => dispatch(StackActions.pop())
});

export default connect(mapStateToProps, mapDispatchToProps)(Layer2WebScreen);

