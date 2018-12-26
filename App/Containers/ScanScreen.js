import React, { Component } from 'react';
import { View, Text, Animated, Easing, Image, Platform } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/ScanScreenStyle';
import { RNCamera } from 'react-native-camera';

class ScanScreen extends Component {

  static navigationOptions = {
      title: '扫码',
  };

  constructor(props) {
      super(props);
      this.data='';
      this.state = {
          animation: new Animated.Value(0),
      };
  }

  _onBarCodeRead(e) {
      if (!e || !e.data) {
          // TODO 001: toast
          return;
      }
      if (this.data.length) return;
      // TODO 002: 校验 是否为 url
      const {data} = e;
      this.data = data;
      const {state} = this.props.navigation;
      state.params.callback({data});
      this.props.navigation.goBack();
  }

  _startAnimation(){
      this.state.animation.setValue(0);
      Animated.timing(this.state.animation,{
          toValue:1,
          duration:1500,
          easing:Easing.linear,
      }).start(()=>this._startAnimation());
  }

  componentDidMount=()=>{
      this.data='';
      this._startAnimation();
      setTimeout(()=>{
          const {state} = this.props.navigation;
          state.params.callback({data:'0XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'});
          this.props.navigation.goBack();
      }, 3000);
  }

  render() {
      const barcodeType = Platform.OS === 'ios' ? [RNCamera.Constants.BarCodeType.qr] : RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE;
      return (
          <RNCamera style={styles.container}
              type={RNCamera.Constants.Type.back}
              barCodeTypes={barcodeType}
              flashMode={RNCamera.Constants.FlashMode.auto}
              onBarCodeRead={(e) => this._onBarCodeRead(e)}>
              <View style={styles.scanBeside}></View>
              <View style={styles.scanSection}>
                  <View style={styles.scanBeside}></View>
                  <View style={styles.scanerView}>
                      <Image style={styles.scaner} source={require('../Images/icon_scan_rect.png')}/>
                      <Animated.View style={[styles.animatedLine, {
                          transform: [{
                              translateY: this.state.animation.interpolate({
                                  inputRange: [0,1],
                                  outputRange: [0,250]
                              })
                          }]
                      }]}/>
                  </View>
                  <View style={styles.scanBeside}></View>
              </View>
              <View style={styles.bottomSection}>
                  <Text style={styles.textStyle}>将二维码放入框内，即可自动扫描</Text>
              </View>
          </RNCamera>);
  }
}



const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);






