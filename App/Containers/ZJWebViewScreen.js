import React, { Component } from 'react';
import { Share, Platform, View } from 'react-native';
import { connect } from 'react-redux';
import WebView from '../NativeComponent/WebView';
import styles from './Styles/ZJWebViewScreenStyle';
import RightComponent from '../Components/RightComponent';
import PassphraseInputAlert from '../Components/PassphraseInputAlert';

const DEFAULT_URI = 'https://www.baidu.com';

class ZJWebViewScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
      title:'Layer2WebView',
      headerRight: (
          <RightComponent
              onPressRefresh={navigation.getParam('onPressRefresh')}
              onPressShare={navigation.getParam('onPressShare')}/>
      ),
  });

  constructor(props){
      super(props);
      this.state={
          isShowPassphrase:false,
      };
  }

  componentDidMount() {
      this.props.navigation.setParams({ onPressRefresh: this._onPressRefresh });
      this.props.navigation.setParams({ onPressShare: this._onPressShare });
  }

  _signInfo=()=>{
      console.log('==============_signInfo======================');
      // 交易
      // 消息

  }

  _onPressConfirm=()=>this._signInfo();

  _onPressRefresh=()=>{
      // this.webview.reload();
      const { passphrase } = this.props;
      // TODO 验证密码有效
      if (passphrase && passphrase.length > 7) {
          this._signInfo();
          return;
      }
      this.setState({
          isShowPassphrase:true,
      });
  }

  _onPressShare= async()=> {
      const title = '消息的标题';
      const message = '要分享的消息';
      let shareParams = {title, message};
      if (Platform.OS === 'ios') {
          const url = 'https://github.com/facebook/react-native';
          const subject = '通过邮件分享的标题';
          shareParams = {url, subject, ...shareParams};
      } else {
          const dialogTitle = 'Android==>dialogTitle';
          shareParams = {dialogTitle, ...shareParams};
      }
      console.log('============shareParams========================');
      console.log(shareParams);
      console.log('===========shareParams=========================');
      try {
          const result = await Share.share(shareParams);
          const {action, activityType} = result;
          if (action === Share.sharedAction) {
              if (activityType) {
                  console.log('===========activityType=========================');
                  console.log(activityType);
              } else {
                  console.log('===========dismissedAction=========================');
                  console.log(activityType);
              }
          } else if (action === Share.dismissedAction){
              console.log('===========dismissedAction=========================');
              console.log(Share.dismissedAction);
          }
      } catch (error) {
          console.log('====================================');
          console.log(error);
          console.log('====================================');
      }
  };

  render () {
      const url = DEFAULT_URI;
      const {isShowPassphrase} = this.state;
      return (
          <View style={styles.container}>
              <PassphraseInputAlert isInit={!isShowPassphrase} onPressConfirm={this._onPressConfirm}/>
              <WebView useWebKit
                  ref ={ref=>this.webview = ref}
                  style={styles.container}
                  source={{url}}/>
          </View>);
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{ passphrase }
    } = state;
    return { passphrase };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ZJWebViewScreen);
