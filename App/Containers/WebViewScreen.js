import React, { Component } from 'react';
import { WebView} from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WebViewScreenStyle';

const DEFAULT_URI = 'https://github.com/facebook/react-native';

class WebViewScreen extends Component {
  componentDidMount=()=>{
      console.log('====================================');
  }
  render () {
      const url = DEFAULT_URI;
      return (
          <WebView style={styles.container} source={{url}} useWebKit/>);
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);
// onError onLoad onLoadEnd onLoadStart renderError [startInLoadingState, renderLoading]
// originWhitelist 白名单
// dataDetectorTypes 监测关键字
