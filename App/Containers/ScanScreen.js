import React, { Component } from 'react';
import { View, Text, InteractionManager, Animated, Easing, Image, Dimensions, Platform,
    Alert,
    Vibration } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/ScanScreenStyle';
import { RNCamera } from 'react-native-camera';

class ScanScreen extends Component {

  static navigationOptions = {
      title: '扫码',
  };

  constructor(props) {
      super(props);
      this.state = {
          animation: new Animated.Value(0),
      };
  }

  _onBarCodeRead(e) {
      console.log('============e========================');
      console.log(e.data);
  }

  _startAnimation(){
      this.state.animation.setValue(0);
      Animated.timing(this.state.animation,{
          toValue:1,
          duration:1500,
          easing:Easing.linear,
      }).start(()=>this._startAnimation());
  }

  componentDidMount(){
      InteractionManager.runAfterInteractions(()=>this._startAnimation());
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
              <View style={styles.bottomSection}></View>
          </RNCamera>);
  }
}



const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ScanScreen);






