import React, { Component } from 'react';
import { WebView, Share, Platform } from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/WebViewScreenStyle';
import RightComponent from '../Components/RightComponent';

const DEFAULT_URI = 'https://github.com/facebook/react-native';

class WebViewScreen extends Component {
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
    this.webview.reload();
}

_onPressShare= async ()=>{
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
                console.log('===========activityType=========================');
            } else {
                console.log('===========dismissedAction=========================');
                console.log(activityType);
                console.log('===========dismissedAction=========================');
            }
        } else if (action === Share.dismissedAction){
            console.log('===========dismissedAction=========================');
            console.log(Share.dismissedAction);
            console.log('===========dismissedAction=========================');
        }
    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
    }
}

_onLoad=(e)=>{
    console.log('=============_onLoad=======================');
}

_onLoadStart=(e)=>{
    console.log('=============_onLoadStart=======================');
}

_onLoadEnd=(e)=>{
    console.log('=============_onLoadEnd=======================');
}

render () {
    const url = DEFAULT_URI;
    return (
        <WebView
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

export default connect(mapStateToProps, mapDispatchToProps)(WebViewScreen);
// onError onLoad onLoadEnd onLoadStart renderError [startInLoadingState, renderLoading]
// originWhitelist 白名单
// dataDetectorTypes 监测关键字
