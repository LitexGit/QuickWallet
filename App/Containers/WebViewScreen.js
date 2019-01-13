import React, { Component } from 'react';
import { WebView, Share, Platform} from 'react-native';
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';
import createInvoke from 'react-native-webview-invoke/native';

const DEFAULT_URI = 'http://litex.io/';

export default class WebViewScreen extends Component {

    constructor(props){
        super(props);
        this.invoke = createInvoke(() => this.webview);
    }

  static navigationOptions = ({ navigation }) => ({
      title:'WebView',
      headerRight: (
          <RightComponent
              onPressRefresh={navigation.getParam('onPressRefresh')}
              onPressShare={navigation.getParam('onPressShare')}/>
      ),
  });

  componentDidMount() {
      this.props.navigation.setParams({ onPressRefresh: this._onPressRefresh });
      this.props.navigation.setParams({ onPressShare: this._onPressShare });
  }


  _onPressRefresh=()=>{
      this.webview.reload();
  }

  _onPressShare=()=>{
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
  }

  _onMessage=(evt)=>{
      console.log('==========RN_onMessage==========================');
      console.log(JSON.parse(evt.nativeEvent.data));
      console.log('==========RN_onMessage==========================');

      const params = JSON.parse(evt.nativeEvent.data);
      const {name} = params;
      switch (name) {
      case 'signTransaction':{
          const message = {
              id: 8888,
              error: null ,
              value: {
                  from: '0xb5538753F2641A83409D2786790b42aC857C5340',
                  gasPrice: '20000000000',
                  gas: '21000',
                  to: '0x38bCc5B8b793F544d86a94bd2AE94196567b865c',
                  value: '1000000000000000000',
                  data: ''
              }
          };
          this.webview.postMessage(JSON.stringify(message));

      }
          break;
      case 'signMessage':{
          const message = {
              id: 8888,
              error: null ,
              value: {
                  data:'signMessage'
              }
          };
          this.webview.postMessage(JSON.stringify(message));
      }
          break;

      default:
          break;
      }
  }

  render () {
      // const {params} =  this.props.navigation.state;
      // const {url=DEFAULT_URI} = params;

      // const alpha = require('../Resources/AlphaWallet-min.js');
      // const injectScript = alpha + signer;

      return (
          <WebView useWebKit
              ref ={ref=>this.webview = ref}
              onMessage={this._onMessage}
              style={styles.container}
              // injectedJavaScript={injectScript}
              source={require('./index.html')}/>
      );
  }
}


