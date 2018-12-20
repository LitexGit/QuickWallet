import React, { Component } from 'react';
import {View, ScrollView, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Slider } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import styles from './Styles/TransferScreenStyle';
import { Colors } from '../Themes';
import Ionicons from 'react-native-vector-icons/Ionicons';

class TransferScreen extends Component {

  static navigationOptions = {
      title:'我的资产',
  }

  constructor(props){
      super(props);
      this.setState({
          displayGas:10,
          minGas: 1,
          maxGas: 100,
      });
  }

  _onPressBtn=()=>{
      this.props.navigate('TransferScreen');
  }
  _onChangeBalance=(text)=>{
      console.log('===========_onChangeBalance=========================');
      console.log(text);
  }
  _onChangeAddress=(text)=>{
      console.log('===========_onChangeAddress=========================');
      console.log(text);
  }
  _onChangeNote=(text)=>{
      console.log('===========_onChangeNote=========================');
      console.log(text);
  }
  _onPressScanning=()=>{
      console.log('===========_onPressScanning=========================');
  }

  _onSlidingComplete=(gas)=>{
      console.log('===========_onSlidingComplete=========================');
      console.log(gas);
  }
  _onSliderChange=(gas)=>{
      console.log('===========_onSliderChange=========================');
      console.log(gas);
      this.setState({
          displayGas: gas
      });
      // ReactNativeHapticFeedback.trigger();
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
      // 计算gas费用更新state
  }
  render () {
      const btnTitle = '下一步';
      const isCanTransfer = true;
      const symbol = 'ETH';
      const assets = 0;

      const {displayGas=10,  minGas=1, maxGas=100} = this.state||{};
      return (
          <View style={styles.container}>
              <ScrollView style={styles.scrollView}>
                  <KeyboardAvoidingView behavior='position'>
                      <View style={styles.bananceSection}>
                          <View style={styles.bananceTopView}>
                              <Text style={styles.titleText}>{symbol}</Text>
                              <Text style={styles.balanceText}>余额:{assets}{symbol}</Text>
                          </View>
                          <TextInput autoFocus style={styles.balanceInput}
                              clearButtonMode='while-editing'
                              multiline={false}
                              placeholder="输入金额"
                              placeholderTextColor={Colors.separateLineColor}
                              underlineColorAndroid={'transparent'}
                              keyboardType='number-pad'
                              onChangeText={this._onChangeBalance}/>
                      </View>
                      <View style={styles.addressSection}>
                          <View style={styles.bananceTopView}>
                              <Text style={styles.titleText}>收款地址</Text>
                              <TouchableOpacity onPress={this._onPressScanning}>
                                  <Ionicons name={'ios-qr-scanner'} size={24} color={'#A4A4A4'}/>
                              </TouchableOpacity>
                          </View>
                          <TextInput style={styles.addressInput}
                              clearButtonMode='while-editing'
                              placeholder="输入以太坊地址"
                              placeholderTextColor={Colors.separateLineColor}
                              underlineColorAndroid={'transparent'}
                              onChangeText={this._onChangeAddress}/>
                          <View style={styles.noteSection}>
                              <Text style={styles.titleText}>备注</Text>
                              <TextInput style={styles.noteInput}
                                  clearButtonMode='while-editing'
                                  placeholder="(选填)"
                                  placeholderTextColor={Colors.separateLineColor}
                                  underlineColorAndroid={'transparent'}
                                  onChangeText={this._onChangeNote}/>
                          </View>
                      </View>
                  </KeyboardAvoidingView>
                  <View style={styles.gaseSection}>
                      <View style={styles.sliderView}>
                          <Text style={[styles.titleText, {fontWeight:'500'}]}>Gas</Text>
                          <Slider style={styles.slider}
                              step={1}
                              value={displayGas}
                              minimumValue={minGas}
                              maximumValue={maxGas}
                              onSlidingComplete={(gas) => this._onSlidingComplete(gas)}
                              onValueChange={(gas) => this._onSliderChange(gas)}/>
                      </View>
                      <Text style={styles.gasText}>{displayGas}gwei</Text>
                  </View>
              </ScrollView>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBtn()}
                      backgroundColor={Colors.textColor}
                      disabled={!isCanTransfer}
                      title={btnTitle}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen);
