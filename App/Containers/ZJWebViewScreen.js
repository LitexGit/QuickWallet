import React, { Component } from 'react';
import { Share, Platform, View, NativeModules} from 'react-native';
import { connect } from 'react-redux';
import WebView from '../NativeComponent/WebView';
import styles from './Styles/ZJWebViewScreenStyle';
import RightComponent from '../Components/RightComponent';
import PassphraseInputAlert from '../Components/PassphraseInputAlert';
import SignTxResultAlert from '../Components/SignTxResultAlert';
import SignMsgResultAlert from '../Components/SignMsgResultAlert';
import WalletActions from '../Redux/WalletRedux';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import Spinner from 'react-native-loading-spinner-overlay';
import Ramda from 'ramda';

const DEFAULT_URI = 'https://www.baidu.com';

class ZJWebViewScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
      title:'Layer2WebView',
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

      NativeModules.SignerModule.onSignerCallback((err, data)=>{
          console.log('==========data==========================');
          console.log(data);
          if (err) {
              // TODO 异常提示
              return;
          }
          this.setState({ isShowSignTx:true });
          this.hash = Ramda.head(data);
      });


  }

  componentWillUnmount=()=>{
      this.lockListener.remove();
      this.isUnlockListener.remove();
  }

  _signInfo=()=>{
      this.props.gethSignHash({passphrase:'11111111', hash:this.hash});
  }

  _onPressRefresh=()=>{
      this.webview.reload();
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

  _onPressShare= async()=> {
      this.setState({
          isShowSignMsg:true,
      });
  };

  render () {
      const url = DEFAULT_URI;
      const {isShowPassphrase, isShowSignTx, isShowSignMsg} = this.state;
      const {loading} = this.props;
      const signInfo = {to:'0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db', balance:100, gas:10};
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
                  style={styles.container}
                  source={{url}}/>
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
    gethSignHash: (params) => dispatch(WalletActions.gethSignHash(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ZJWebViewScreen);


// const title = '消息的标题';
// const message = '要分享的消息';
// let shareParams = {title, message};
// if (Platform.OS === 'ios') {
//     const url = 'https://github.com/facebook/react-native';
//     const subject = '通过邮件分享的标题';
//     shareParams = {url, subject, ...shareParams};
// } else {
//     const dialogTitle = 'Android==>dialogTitle';
//     shareParams = {dialogTitle, ...shareParams};
// }
// try {
//     const result = await Share.share(shareParams);
//     const {action, activityType} = result;
//     if (action === Share.sharedAction) {
//         if (activityType) {
//             console.log(activityType);
//         } else {
//             console.log(activityType);
//         }
//     } else if (action === Share.dismissedAction){
//         console.log(Share.dismissedAction);
//     }
// } catch (error) {
//     console.log(error);
// }
