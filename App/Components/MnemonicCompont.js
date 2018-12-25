import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { View, Text, ScrollView, KeyboardAvoidingView, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/MnemonicCompontStyle';
import { Button } from 'react-native-elements';
import { Colors, Metrics } from '../Themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WalletActions from '../Redux/WalletRedux';
import Spinner from 'react-native-loading-spinner-overlay';


class MnemonicCompont extends Component {
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

    constructor (props) {
        super(props);
        this.password = '';
        this.confirm = '';
        this.mnemonic = '';

        this.state = {
            isCanPress:false,
            isShowPassword:false,
        };
    }

  _onPressBtn=()=>{
      this.props.gethImportMnemonic({mnemonic:this.mnemonic, passphrase:this.password});
  }

  _onChangeMnemonic=(text)=>{
      this.mnemonic = text;
      this._checkInputIsValid();
  }

  _onChangePassword=(text)=>{
      this.password = text;
      this._checkInputIsValid();
  }

  _onChangeConfirm=(text)=>{
      this.confirm = text;
      this._checkInputIsValid();
  }

  _onPressNext=()=>console.log();

  _onPressEyeImg = ()=>{
      const {isShowPassword} = this.state;
      this.setState({
          isShowPassword:!isShowPassword
      });
  }

  componentDidMount=()=>{
      this.props.setLoading({loading:false});
      this.mnemonic = 'tag fee recycle palace nominee van dawn mail approve crash opinion scheme';
      this._checkInputIsValid();
  }

  _checkInputIsValid=()=>{
      // TODO mnemonic 合法性校验
      if (this.mnemonic.length && this.password.length > 7 &&  this.confirm.length > 7) {
          if (this.password === this.confirm) {
              this.setState({isCanPress:true});
              return;
          }
      }
      this.setState({isCanPress:false});
  }

  render () {
      const remind = '使用助记词导入时可以修改钱包密码。';
      const path = 'm/44’/60‘/0’/0';

      const {isCanPress, isShowPassword} = this.state;
      const {loading} = this.props;

      const eyeImg = (
          <TouchableOpacity onPress={()=>this._onPressEyeImg()}>
              {isShowPassword ? <Ionicons name={'md-eye'} size={Metrics.icons.small} color={Colors.separateLineColor}/> : <Ionicons name={'md-eye-off'} size={Metrics.icons.small} color={Colors.separateLineColor}/>}
          </TouchableOpacity>);

      return (
          <View style={styles.container}>
              <Spinner visible={loading} cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}/>
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
                              value={ this.mnemonic }
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

const mapStateToProps = (state) => {
    const {
        wallet:{loading}
    } = state;
    return {
        loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (params) => dispatch(WalletActions.setLoading(params)),
    gethImportMnemonic: (params) => dispatch(WalletActions.gethImportMnemonic(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MnemonicCompont);

