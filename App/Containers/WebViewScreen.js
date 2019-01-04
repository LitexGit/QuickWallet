import React, { Component } from 'react';
import { WebView, Share, Platform } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';

const DEFAULT_URI = 'http://litex.io/';

class WebViewScreen extends Component {
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
    Share.share(shareParams);
}

render () {
    const {params} =  this.props.navigation.state;
    const {url=DEFAULT_URI} = params;
    return (
        <WebView useWebKit
            ref ={ref=>this.webview = ref}
            style={styles.container}
            source={{uri:url}}/>
    );
}
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);


