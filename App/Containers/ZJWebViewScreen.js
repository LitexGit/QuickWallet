import React, { Component } from 'react';
import {} from 'react-native';
import { connect } from 'react-redux';
import ZJWebView from '../NativeComponent/ZJWebView';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ZJWebViewScreenStyle';

const DEFAULT_URI = 'https://www.baidu.com';

class ZJWebViewScreen extends Component {
  componentDidMount=()=>{
      console.log('====================================');
  }
  render () {
      const url = DEFAULT_URI;
      return (
          <ZJWebView style={styles.container} source={{url}} useWebKit/>);
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ZJWebViewScreen);
// onError onLoad onLoadEnd onLoadStart renderError [startInLoadingState, renderLoading]
// originWhitelist 白名单
// dataDetectorTypes 监测关键字
