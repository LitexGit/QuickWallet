import React, { Component } from 'react';
import { View, Text, Animated, Easing, Image, Platform } from 'react-native';
import styles from './Styles/ScanScreenStyle';
import { RNCamera } from 'react-native-camera';
import I18n from '../I18n';

export default class ScanScreen extends Component {

  static navigationOptions = {
      title:I18n.t('ScanTabTitle'),
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
          state.params.callback({data:'0x38bCc5B8b793F544d86a94bd2AE94196567b865c'});
          this.props.navigation.goBack();
      }, 3000);
  }

  render() {
      const contentView = (<View style={styles.container}>
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
              <Text style={styles.textStyle}>{I18n.t('ScanRemind')}</Text>
          </View>
      </View>);

      const camera = Platform.OS === 'ios' ? (<RNCamera style={styles.container}
          type={RNCamera.Constants.Type.back}
          barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={(e) => this._onBarCodeRead(e)}>
          {contentView}
      </RNCamera>) : (<RNCamera style={styles.container}
          type={RNCamera.Constants.Type.back}
          googleVisionBarcodeType = {RNCamera.Constants.GoogleVisionBarcodeDetection.BarcodeType.QR_CODE}
          flashMode={RNCamera.Constants.FlashMode.auto}
          onBarCodeRead={(e) => this._onBarCodeRead(e)}>
          {contentView}
      </RNCamera>);

      return (
          <View style={styles.container}>
              {camera}
          </View>);
  }
}








