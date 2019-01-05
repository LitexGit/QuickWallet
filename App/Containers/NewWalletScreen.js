import React, { Component } from 'react';
import { Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/NewWalletScreenStyle';
import { View } from 'react-native-animatable';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Metrics } from '../Themes';
import InputInfoConfig from '../Config/InputInfoConfig';
import { Button } from 'react-native-elements';
import UserTermsAlert from '../Components/UserTermsAlert';
import { NavigationActions } from 'react-navigation';
import WalletActions from '../Redux/WalletRedux';
import UserActions from '../Redux/UserRedux';
import I18n from '../I18n';
import LevelComponent from '../Components/LevelComponent';
import {getPasspraseStrength} from '../Lib/Utils';

class NewWalletScreen extends Component {
  static navigationOptions = {
      title:I18n.t('NewWalletTabTitle'),
  }

  constructor (props) {
      super(props);
      this.name = '';
      this.password = '';
      this.confirm = '';
      this.state = {
          isShowRemind:false,
          isInputValid:false,
          isShowPassword:false,
          strength:0
      };
  }

  _onChangeText=(key, text)=>{
      console.log(key);
      switch (key) {
      case InputInfoConfig.name.key:
          this.name = text;
          break;
      case InputInfoConfig.password.key:{
          this.password = text;
          this.setState({strength:getPasspraseStrength(text)});
      }

          break;
      case InputInfoConfig.confirm.key:
          this.confirm = text;
          break;
      default:
          break;
      }
      this._checkInputIsValid();
  }

  _onFocus=(key)=>{
      if (key === InputInfoConfig.password.key) {
          this.setState({isShowRemind:true});
          return;
      }
      this.setState({isShowRemind:false});
  }

  _onPressEyeImg = ()=>{
      const {isShowPassword} = this.state;
      this.setState({
          isShowPassword:!isShowPassword
      });
  }
  /*
    1:新建钱包
    01:success: => register
    02:failure: => TODO 应该不存在失败
  */
  _onPressBtn = ()=>{
      this.props.saveUserInfo({nickname:this.name});
      this.props.savePassphrase({passphrase:this.password});
      this.props.navigate('PreBackupScreen');
  }

  _checkInputIsValid=()=>{
      // TODO
      if (this.password.length > 7 &&  this.confirm.length > 7) {
          if (this.password === this.confirm) {
              this.setState({isInputValid:true});
              return;
          }
      }
      this.setState({isInputValid:false});
  }


  render () {
      const {isAgree} = this.props;

      const {isShowRemind, isInputValid, isShowPassword, strength}=this.state;

      const remindView = isShowRemind ? (<View style={styles.remindView}>
          <Ionicons name={'ios-lock'} size={Metrics.icons.small} color={Colors.separateLineColor}/>
          <View style={styles.rightRemind}>
              <Text style={styles.remindText}>{ I18n.t('NewWalletRemind001') }</Text>
              <Text style={[styles.remindText, {marginTop: Metrics.smallMargin}]}>{ I18n.t('NewWalletRemind002') }</Text>
          </View>
      </View>) : null;


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
                      onFocus={()=>this._onFocus(key)}
                  />
                  {key === 'password' ? <View style={styles.levelView}>
                      <LevelComponent level={strength}/>
                  </View> : null}
                  {key === 'confirm' ? eyeImg : null}
              </View>
          );
      });
      const userTermsView = (!isAgree ? (<View zIndex={999} style={styles.userTermsStyle}>
          <UserTermsAlert/>
      </View>): null);
      return (
          <View style={styles.container}>
              {userTermsView}
              <View style={styles.topSection}>
                  <SimpleLineIcons name={'wallet'} size={30} color={Colors.separateLineColor}/>
                  <Text style={styles.titleStytle}>{ I18n.t('CreatAction') }</Text>
              </View>
              <KeyboardAvoidingView behavior='position' keyboardVerticalOffset={100}>
                  <View style={styles.inputSection}>
                      {inputs}
                      {remindView}
                  </View>
              </KeyboardAvoidingView>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBtn()}
                      disabled={!isInputValid}
                      containerViewStyle={styles.containerViewStyle}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.btnTitle}
                      backgroundColor={isInputValid ? Colors.textColor : Colors.separateLineColor}
                      title={I18n.t('Create')}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{loading},
        user:{
            isAgreeInfo:isAgree
        }
    } = state;
    return {
        loading, isAgree
    };
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    savePassphrase: ({passphrase}) => dispatch(WalletActions.savePassphrase({passphrase})),
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen);
