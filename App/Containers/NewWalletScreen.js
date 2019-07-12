import React, { Component } from 'react';
import { Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/NewWalletScreenStyle';
import { View } from 'react-native-animatable';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Metrics } from '../Themes';
import InputInfoConfig from '../Config/InputInfoConfig';
import CommomBtnComponent from '../Components/CommomBtnComponent';
import UserTermsAlert from '../Components/UserTermsAlert';
import { NavigationActions } from 'react-navigation';
import WalletActions from '../Redux/WalletRedux';
import UserActions from '../Redux/UserRedux';
import I18n from '../I18n';
import LevelComponent from '../Components/LevelComponent';
import { getPasspraseStrength } from '../Lib/Utils';
import Toast from 'react-native-root-toast';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import Spinner from 'react-native-loading-spinner-overlay';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import {getInputConfigTitle} from '../Lib/Transfer'

class NewWalletScreen extends Component {

  static navigationOptions = {
    title: I18n.t('NewWalletTabTitle')
  }

  constructor(props) {
    super(props);
    this.name = '';
    this.password = '';
    this.confirm = '';
    this.state = {
      isShowRemind: false,
      isInputValid: false,
      isShowPassword: false,
      strength: 0
    };
  }

  componentDidMount = () => {
    DeviceStorage.setItem(Keys.IS_NEW_SCREEN_DID_MOUNT, true);
    this.props.setLoading({ loading: false });
    this.isUnlockListener = EventEmitter.addListener(EventKeys.IS_NEW_WALLET_SUCCESS, ({ status, msg }) => {
      if (!status) {
        return;
      }
      Toast.show(msg, {
        shadow: true,
        position: Toast.positions.CENTER
      });
      this.props.navigate('PreBackupScreen');
    });
  }

  _onChangeText = (key, text) => {
    console.log(key);
    switch (key) {
      case InputInfoConfig.name.key:
        this.name = text;
        break;
      case InputInfoConfig.password.key: {
        this.password = text;
        this.setState({ strength: getPasspraseStrength(text) });
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

  _onFocus = (key) => {
    if (key === InputInfoConfig.password.key) {
      this.setState({ isShowRemind: true });
      return;
    }
    this.setState({ isShowRemind: false });
  }

  _onPressEyeImg = () => {
    const { isShowPassword } = this.state;
    this.setState({
      isShowPassword: !isShowPassword
    });
  }
  _onPressBtn = () => {
    let error = '密码不少于8位字符';
    if (this.password.length >= 8 && this.confirm.length >= 8) {
      if (this.password === this.confirm) {
        this.props.saveUserInfo({ nickname: this.name });
        this.props.gethNewWallet({ passphrase: this.password });
        return;
      }
      error = '密码输入不一致';
    }
    Toast.show(error, {
      shadow: true,
      position: Toast.positions.CENTER
    });
  }

  _checkInputIsValid = () => {
    if (this.password.length && this.confirm.length) {
      this.setState({ isInputValid: true });
    } else {
      this.setState({ isInputValid: false });
    }
  }

  render() {
    const { isAgree, loading } = this.props;

    const { isShowRemind, isInputValid, isShowPassword, strength } = this.state;

    const remindView = isShowRemind ? (<View style={styles.remindView}>
      <Ionicons name={'ios-lock'}
          size={Metrics.icons.small}
          color={Colors.separateLineColor}
      />
      <View style={styles.rightRemind}>
        <Text style={styles.remindText}>{I18n.t('NewWalletRemind001')}</Text>
        <Text style={[styles.remindText, { marginTop: Metrics.smallMargin }]}>{I18n.t('NewWalletRemind002')}</Text>
      </View>
    </View>) : null;


    const inputs = Object.values(InputInfoConfig).map((config, index) => {
      const { key, placeholder, placeholderColor, clearButtonMode, maxLength, keyboardType, returnKeyType } = config;

      const eyeImg = (
        <TouchableOpacity onPress={() => this._onPressEyeImg()}>
          {isShowPassword ? <Ionicons name={'md-eye'}
              size={Metrics.icons.small}
              color={Colors.separateLineColor}
                            /> : <Ionicons name={'md-eye-off'}
                                size={Metrics.icons.small}
                                color={Colors.separateLineColor}
                                 />}
        </TouchableOpacity>);
      return (
        <View key={index}
            style={styles.inputView}
        >
          <TextInput style={styles.textInput}
              placeholder={getInputConfigTitle(key)}
              placeholderTextColor={placeholderColor}
              clearButtonMode={clearButtonMode}
              maxLength={maxLength}
              secureTextEntry={key !== 'name' ? !isShowPassword : false}
              keyboardType={keyboardType}
              returnKeyType={returnKeyType}
              underlineColorAndroid="transparent"
              onChangeText={(text) => this._onChangeText(key, text)}
              onFocus={() => this._onFocus(key)}
          />
          {key === 'password' ? <View style={styles.levelView}>
            <LevelComponent level={strength} />
          </View> : null}
          {key === 'confirm' ? eyeImg : null}
        </View>
      );
    });
    const userTermsView = (!isAgree ? (<View zIndex={999}
        style={styles.userTermsStyle}
                                       >
      <UserTermsAlert />
    </View>) : null);
    return (
      <View style={styles.container}>
        <Spinner visible={loading}
            cancelable
            textContent={'Loading...'}
            textStyle={styles.spinnerText}
        />
        {userTermsView}
        <KeyboardAvoidingView behavior="position"
            keyboardVerticalOffset={100}
        >
          <View style={styles.topSection}>
            <SimpleLineIcons name={'wallet'}
                size={30}
                color={Colors.separateLineColor}
            />
            <Text style={styles.titleStytle}>{I18n.t('CreatAction')}</Text>
          </View>
          <View style={styles.inputSection}>
            {inputs}
            {remindView}
          </View>
        </KeyboardAvoidingView>
        <View style={styles.bottomSection}>
          <View style={styles.bottomBtnSection}>
            <CommomBtnComponent
                disabled={!isInputValid}
                title={I18n.t('Create')}
                onPress={() => this._onPressBtn()}
            />
          </View>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    wallet: { loading },
    user: { isAgreeInfo: isAgree }
  } = state;
  return {
    loading, isAgree
  };
};

const mapDispatchToProps = (dispatch) => ({
  navigate: (route) => dispatch(NavigationActions.navigate({ routeName: route })),
  saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
  setLoading: ({ loading }) => dispatch(WalletActions.setLoading({ loading })),
  gethNewWallet: (params) => dispatch(WalletActions.gethNewWallet(params))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewWalletScreen);
