import React, { Component } from 'react';
import { WebView, Share, Platform } from 'react-native';
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';
import { getDocumentTitle } from '../Resources/inject';
import { SafeAreaView } from 'react-navigation';
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

  _onPressShare = async () => {
    const { url } = this.props.navigation.state.params;
    let shareParams = {};
    if (Platform.OS === 'ios') {
      shareParams = { url, title: this.title };
    } else {
      shareParams = { message: url, title: this.title };
    }
    await Share.share(shareParams);
  };

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
    this.title = title;
    this.props.navigation.setParams({ title })
  }

  render() {
    // const { params } = this.props.navigation.state;
    // const { url = DEFAULT_URI } = params;
    const injectScript = getDocumentTitle;
    return (
      <SafeAreaView style={styles.container}>
        <WebView useWebKit
            ref={ref => this.webview = ref}
            style={styles.container}
            injectedJavaScript={injectScript}
            onMessage={this._onMessage}
            source={{ uri: DEFAULT_URI }}
        />
      </SafeAreaView>
    );
  }
}


