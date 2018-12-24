import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { View, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/KeyStoreCompontStyle';
import { Button } from 'react-native-elements';
import { Colors, Metrics } from '../Themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import GethModule from '../Lib/NativeBridge/WalletUtils';

export default class KeyStoreCompont extends Component {
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
    _onPressBtn= async ()=>{
        const address = await GethModule.importPrivateKey();
        console.log('=======RN======address=======================');
        console.log(address);
        console.log('=======RN======address=======================');
    }

    _onChangePrivateKey=()=>{
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
      const remind = '输入 Private Key 文件内容至输入框。或通过扫描 Private Key 内容生成的二维码录入。请留意字符大小写';
      const isCanPress = true;
      const privateKey = 'privateKeyprivateKeyprivateKeyprivateKeyprivateKeyprivateKeyprivateKey';
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
                              placeholder='输入明文私钥'
                              placeholderTextColor={ Colors.separateLineColor }
                              underlineColorAndroid={ 'transparent' }
                              style={ styles.privateKeyInput }
                              value={ privateKey }
                              onChangeText={(text) => this._onChangePrivateKey(text)}/>
                      </KeyboardAvoidingView>
                  </View>
                  <View style={styles.infoView}>
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
