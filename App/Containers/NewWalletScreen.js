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

// import { NavigationActions } from 'react-navigation';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import WalletActions from '../Redux/WalletRedux';

import Spinner from 'react-native-loading-spinner-overlay';


class NewWalletScreen extends Component {
  static navigationOptions = {
      title:'创建账户',
  }

  constructor (props) {
      super(props);
      this.name = '';
      this.password = '';
      this.confirm = '';
      this.state = {
          isAgreedUseTerms:true,
          isShowRemind:false,
          isInputValid:false,
          isShowPassword:false,
      };
  }

  _onChangeText=(key, text)=>{
      console.log(key);
      switch (key) {
      case InputInfoConfig.name.key:
          this.name = text;
          break;
      case InputInfoConfig.password.key:
          this.password = text;
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
      this.props.gethNewAccount({passphrase:this.password});
      // this.props.navigate('PreBackupScreen');
  }

  _checkInputIsValid=()=>{
      // TODO
      if (this.name.length && this.password.length > 7 &&  this.confirm.length > 7) {
          if (this.password === this.confirm) {
              this.setState({isInputValid:true});
              return;
          }
      }
      this.setState({isInputValid:false});
  }

  componentDidMount= async ()=>{
      this.props.setLoading({loading:false});
      const isAgreedUseTerms = await DeviceStorage.getItem(Keys.IS_SELECTED_USE_TERMS);
      this.setState({ isAgreedUseTerms });
  }

  render () {
      const remind001 = '密码用于加密保护私钥，以及转账，调用合约等, 所以强度非常重要';
      const remind002 = 'QuickWallet 不存储密码,也无法帮您找回,请务必牢记';

      const {loading} = this.props;

      const {isAgreedUseTerms, isShowRemind, isInputValid, isShowPassword}=this.state;

      const remindView = isShowRemind ? (<View style={styles.remindView}>
          <Ionicons name={'ios-lock'} size={Metrics.icons.small} color={Colors.separateLineColor}/>
          <View style={styles.rightRemind}>
              <Text style={styles.remindText}>{remind001}</Text>
              <Text style={[styles.remindText, {marginTop: Metrics.smallMargin}]}>{remind002}</Text>
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
                  {key === 'confirm' ? eyeImg : null}
              </View>
          );
      });
      const userTermsView = (!isAgreedUseTerms ? (<View zIndex={999} style={styles.userTermsStyle}>
          <UserTermsAlert/>
      </View>): null);
      return (
          <View style={styles.container}>
              {userTermsView}
              <Spinner visible={loading} cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}/>
              <View style={styles.topSection}>
                  <SimpleLineIcons name={'wallet'} size={30} color={Colors.separateLineColor}/>
                  <Text style={styles.titleStytle}>创建账户</Text>
              </View>
              <KeyboardAvoidingView>
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
                      title='创建'/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {

    const {
        wallet:{loading}
    } = state;
    return {
        loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    // navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    gethNewAccount: (params) => dispatch(WalletActions.gethNewAccount(params)),
    setLoading: ({loading}) => dispatch(WalletActions.setLoading({loading})),
});

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen);
