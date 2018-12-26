import React, { Component } from 'react';
import {} from 'react-native';
import { connect } from 'react-redux';
import WebView from '../NativeComponent/WebView';
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
      WebView.reload();
  }

  _onPressShare=()=> console.log();

  render () {
      const url = DEFAULT_URI;
      return (
          <WebView useWebKit
              ref ={ref=>this.webview = ref}
              style={styles.container}
              source={{url}}/>);
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ZJWebViewScreen);
