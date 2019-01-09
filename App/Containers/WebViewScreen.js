import React, { Component } from 'react';
import { WebView, Share, Platform ,Alert} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';

import createInvoke from 'react-native-webview-invoke/native';

const DEFAULT_URI = 'http://litex.io/';

class WebViewScreen extends Component {

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


  _webInitialize = () => {
      this.timer = setTimeout(() => {
          console.log('=========1=====JS Call RN init======================');
          return 'JS Call RN init';

      }, 1000);
      console.log('===========2===JS Call RN init======================');
  };

  _webWannaGet = () => {
      this.timer = setTimeout(() => 'JS Call RN, RN callBack Hi LXT', 10);
  };

  _webWannaSet = (data) => {
      Alert.alert( 'JS Set RN', data,
          [{text: '取消', style: 'cancel'}, {text: '确定'}],
          { cancelable: false }
      );
  };

  componentDidMount() {
      this.props.navigation.setParams({ onPressRefresh: this._onPressRefresh });
      this.props.navigation.setParams({ onPressShare: this._onPressShare });

      this.invoke
          .define('init', this._webInitialize)
          .define('get', this._webWannaGet)
          .define('set', this._webWannaSet);
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

render () {
    const {params} =  this.props.navigation.state;
    const {url=DEFAULT_URI} = params;

    return (
        <WebView useWebKit
            ref ={webview=>this.webview = webview}
            onMessage={this.invoke.listener}
            style={styles.container}
            source={require('./index.html')}/>
    );
}
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);


