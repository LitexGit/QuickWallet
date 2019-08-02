import React, { Component } from 'react';
import { WebView, Share, Platform } from 'react-native';
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';
import createInvoke from 'react-native-webview-invoke/native';

const DEFAULT_URI = 'http://litex.io/';

export default class WebViewScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: 'WebView',
    headerRight: (
      <RightComponent
          onPressRefresh={navigation.getParam('onPressRefresh')}
          onPressShare={navigation.getParam('onPressShare')}
      />
    )
  });

  constructor(props) {
    super(props);
    this.invoke = createInvoke(() => this.webview);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onPressRefresh: this._onPressRefresh });
    this.props.navigation.setParams({ onPressShare: this._onPressShare });
  }


  _onPressRefresh = () => {
    this.webview.reload();
  }

  _onPressShare = () => {
    const shareUrl = 'http://litex.io/';
    const { sharecode } = this.props;
    let shareParams = {};
    if (Platform.OS === 'ios') {
      const url = shareUrl + '?sharecode=' + sharecode;
      shareParams = { url };
    } else {
      const message = shareUrl + '?sharecode=' + sharecode;
      shareParams = { message };
    }
    Share.share(shareParams);
  }

  render() {
    const { params } = this.props.navigation.state;
    const { url = DEFAULT_URI } = params;
    return (
      <WebView useWebKit
          ref={ref => this.webview = ref}
          style={styles.container}
          source={{ uri: url }}
      />
    );
  }
}


