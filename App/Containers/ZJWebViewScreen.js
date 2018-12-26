import React, { Component } from 'react';
import {View} from 'react-native';
import { connect } from 'react-redux';
import ZJWebView from '../NativeComponent/ZJWebView';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/ZJWebViewScreenStyle';
import RightComponent from '../Components/RightComponent';

const DEFAULT_URI = 'https://www.baidu.com';

class ZJWebViewScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
      title:'Ethereum Accounts',
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
      console.log('==============this.webView======================');
      console.log(this.webView);
      this.webView.goBack(0);
      console.log('=============this.webView=======================');
  }

  _onPressShare=()=>{
      console.log('===========_onPressShare=========================');
  }

  _onLoad=(e)=>{
      console.log('=============_onLoad=======================');
      console.log(e);
      console.log('=============_onLoad=======================');

  }

  _onLoadStart=(e)=>{
      console.log('=============_onLoadStart=======================');
      console.log(e);
      console.log('=============_onLoadStart=======================');
  }

  _onLoadEnd=(e)=>{
      console.log('=============_onLoadEnd=======================');
      console.log(e);
      console.log('=============_onLoadEnd=======================');
  }


  render () {
      const url = DEFAULT_URI;
      return (
          <ZJWebView
              ref ={ref=>this.webview = ref}
              style={styles.container}
              source={{url}}
              // useWebKit
              onLoadStart={this._onLoadStart}
              onLoad={this._onLoad}
              onLoadEnd={this._onLoadEnd}/>);
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
