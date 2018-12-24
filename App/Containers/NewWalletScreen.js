import React, { Component } from 'react';
import { Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import styles from './Styles/NewWalletScreenStyle';
import { View } from 'react-native-animatable';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Metrics } from '../Themes';
import InputInfoConfig from '../Config/InputInfoConfig';
import { Button } from 'react-native-elements';
import UserTermsAlert from '../Components/UserTermsAlert';

import { NavigationActions } from 'react-navigation';
import UserActions from '../Redux/UserRedux';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';


class NewWalletScreen extends Component {
  static navigationOptions = {
      title:'创建账户',
  }

  _onChangeText=(key, text)=>{
      console.log('==============text======================');
  }

  _onPressEyeImg = ()=>{
      console.log('============_onPressEyeImg========================');
  }

  _onPressBtn=()=>{
      const address = '0X11111';
      const type = 1;
      const params = {address, type};
      const {register} = this.props;
      register(params);
  }

  componentDidMount= async ()=>{
      DeviceStorage.saveItem(Keys.IS_SELECTED_USE_TERMS, true);
      const isUserTerms = await DeviceStorage.getItem(Keys.IS_SELECTED_USE_TERMS);
  }

  render () {
      const isShowPassword = false;
      const isCanPress = true;

      const inputs = Object.values(InputInfoConfig).map((config, index)=>{
          const {key, placeholder, placeholderColor, clearButtonMode, maxLength, keyboardType, returnKeyType} = config;
          const eyeImg = (
              <TouchableOpacity onPress={()=>this._onPressEyeImg()}>
                  {isShowPassword ? <Ionicons name={'md-eye'} size={Metrics.icons.small} color={Colors.separateLineColor}/> : <Ionicons name={'md-eye-off'} size={Metrics.icons.small} color={Colors.separateLineColor}/>}
              </TouchableOpacity>);
          return (
              <View key={index} style={styles.inputView}>
                  <TextInput style={styles.textInput}
                      placeholder={ placeholder }
                      placeholderTextColor = { placeholderColor }
                      clearButtonMode={ clearButtonMode }
                      maxLength={ maxLength }
                      secureTextEntry={ key !== 'name' ? !isShowPassword : false }
                      keyboardType={ keyboardType }
                      returnKeyType= {returnKeyType}
                      underlineColorAndroid="transparent"
                      onChangeText={(text)=>this._onChangeText(key, text)}
                  />
                  {key === 'confirm' ? eyeImg : null}
              </View>
          );
      });
      return (
          <View style={styles.container}>
              <UserTermsAlert isShow/>
              <View style={styles.topSection}>
                  <SimpleLineIcons name={'wallet'} size={30} color={Colors.separateLineColor}/>
                  <Text style={styles.titleStytle}>创建账户</Text>
              </View>
              <KeyboardAvoidingView>
                  <View style={styles.inputSection}>
                      {inputs}
                  </View>
              </KeyboardAvoidingView>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBtn()}
                      containerViewStyle={styles.containerViewStyle}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.btnTitle}
                      backgroundColor={isCanPress ? Colors.textColor : Colors.separateLineColor}
                      disabled={!isCanPress}
                      title='创建'/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    register: (params) => dispatch(UserActions.registerRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen);
