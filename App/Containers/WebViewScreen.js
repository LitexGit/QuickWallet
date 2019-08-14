import React, { Component } from 'react';
import { WebView, Share, Platform } from 'react-native';
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';
import { getDocumentTitle } from '../Resources/inject';

const DEFAULT_URI = 'http://litex.io/';

export default class WebViewScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: '' || navigation.getParam('title'),
    headerRight: (
      <RightComponent
          onPressRefresh={navigation.getParam('onPressRefresh')}
          onPressShare={navigation.getParam('onPressShare')}
      />
    )
  });

  constructor(props) {
    super(props);
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

  _onMessage = (evt) => {
    const data = evt.nativeEvent.data;
    if (typeof data !== 'string') return

    try {
      params = JSON.parse(evt.nativeEvent.data)
    } catch (error) {
      console.log(evt.nativeEvent);
      console.log(error);
      return
    }

    const { name } = params;
    if (name !== 'getDocumentTitle') return
    const {title} = params;
    this.props.navigation.setParams({ title })
  }

  render() {
    // const { params } = this.props.navigation.state;
    // const { url = DEFAULT_URI } = params;
    const injectScript = getDocumentTitle;
    return (
      <WebView useWebKit
          ref={ref => this.webview = ref}
          style={styles.container}
          injectedJavaScript={injectScript}
          onMessage={this._onMessage}
          source={{ uri: DEFAULT_URI }}
      />
    );
  }
}


