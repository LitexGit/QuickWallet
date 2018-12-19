import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { View, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/MnemonicCompontStyle';
import { Button } from 'react-native-elements';
import { Colors, Metrics } from '../Themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';


export default class MnemonicCompont extends Component {
    // // Prop type warnings
    // static propTypes = {
    //   someProperty: PropTypes.object,
    //   someSetting: PropTypes.bool.isRequired,
    // }
    //
    // // Defaults for props
    // static defaultProps = {
    //   someSetting: false
    // }

  _onPressBtn=()=>{
      console.log('==============_onPressBtn=====================');
  }

  _onChangeMnemonic=()=>{
      console.log('==============_onChangeText=====================');
  }

  _onChangePassword=()=>{
      console.log('==============_onChangePassword=====================');
  }

  _onChangeConfirm=()=>{
      console.log('==============_onChangeConfirm=====================');
  }

  _onPressNext=()=>{
      console.log('==============_onPressNext=====================');
  }

  _onPressEyeImg = ()=>{
      console.log('============_onPressEyeImg========================');
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  render () {
      const remind = '使用助记词导入时可以修改钱包密码。';
      const isCanPress = true;
      const mnemonic = 'mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic mnemonic';
      const path = 'm/44’/60‘/0’/0';
      const isShowPassword = false;

      const eyeImg = (
          <TouchableOpacity onPress={()=>this._onPressEyeImg()}>
              {isShowPassword ? <Ionicons name={'md-eye'} size={Metrics.icons.small} color={Colors.separateLineColor}/> : <Ionicons name={'md-eye-off'} size={Metrics.icons.small} color={Colors.separateLineColor}/>}
          </TouchableOpacity>);

      return (
          <View style={styles.container}>
              <ScrollView style={styles.topSection}>
                  <View style={styles.remindView}>
                      <Text style={styles.remindText}>{remind}</Text>
                  </View>
                  <View style={styles.mnemonicView}>
                      <KeyboardAvoidingView>
                          <TextInput
                              multiline
                              placeholder='输入助记词，用空格分隔离'
                              placeholderTextColor={ Colors.separateLineColor }
                              underlineColorAndroid={ 'transparent' }
                              style={ styles.mnemonicInput }
                              value={ mnemonic }
                              onChangeText={(text) => this._onChangeMnemonic(text)}/>
                      </KeyboardAvoidingView>
                  </View>
                  <View style={styles.infoView}>
                      <View style={styles.sectionView}>
                          <View style={styles.pathTop}>
                              <Text style={styles.pathText}>选择路径</Text>
                              <TouchableOpacity onPress={()=>this._onPressNext()}>
                                  <View style={styles.nextView}>
                                      <Text style={styles.nextText}>默认</Text>
                                      <MaterialIcons name={'navigate-next'} size={Metrics.icons.small} color={Colors.textColor}/>
                                  </View>
                              </TouchableOpacity>
                          </View>
                          <Text style={[styles.sectionText, styles.pathText]}>{path}</Text>
                      </View>
                      <View style={ styles.sectionView }>
                          <View style={ styles.section }>
                              <Text style={[styles.pathText, {lineHeight:Metrics.icons.tiny}]}>设置密码</Text>
                              <AntDesign name={'warning'} size={Metrics.icons.tiny} color={Colors.separateLineColor} style={styles.warning}/>
                          </View>
                          <KeyboardAvoidingView style={styles.section}>
                              <TextInput style={styles.passwordInput}
                                  // multiline
                                  placeholder='钱包密码'
                                  placeholderTextColor={ Colors.separateLineColor }
                                  underlineColorAndroid={ 'transparent' }
                                  clearButtonMode='while-editing'
                                  secureTextEntry={!isShowPassword}
                                  maxLength={ 20 }
                                  onChangeText={(text) => this._onChangePassword(text)}/>
                          </KeyboardAvoidingView>
                      </View>
                      <KeyboardAvoidingView style={styles.confirmView}>
                          <TextInput style={styles.section}
                              // multiline
                              placeholder='重复输入密码'
                              placeholderTextColor={ Colors.separateLineColor }
                              underlineColorAndroid={ 'transparent' }
                              clearButtonMode='while-editing'
                              secureTextEntry={!isShowPassword}
                              maxLength={ 20 }
                              onChangeText={(text) => this._onChangeConfirm(text)}/>
                          {eyeImg}
                      </KeyboardAvoidingView>
                  </View>
              </ScrollView>
              <View style={styles.botttomSection}>
                  <Button onPress={()=>this._onPressBtn()}
                      textStyle={styles.btnTitle}
                      backgroundColor={isCanPress ? Colors.textColor : Colors.separateLineColor}
                      disabled={!isCanPress}
                      title='导入'/>
              </View>
          </View>
      );
  }
}


// 设置密码
