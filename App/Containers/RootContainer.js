import React, { Component } from 'react';
import { View, StatusBar, Text } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import styles from './Styles/RootContainerStyles';

import WalletActions from '../Redux/WalletRedux';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';

import UserActions from '../Redux/UserRedux';
import ConfigActions from '../Redux/ConfigRedux';
import { LanguageConfig, CurrencyConfig } from '../Config/MineConfig';
import { Preferences, PrefKeys } from '../Lib/Preferences';

class RootContainer extends Component {

  componentDidMount() {
    console.log('=============01==RootContainer=====================');
    this._initializes();
  }
  _initializes = async () => {
    this.props.getInjectScript();

    const language = Preferences.getPrefsObjectBy(PrefKeys.LANGUAGE_ENVIRONMENT) || LanguageConfig.zh;
    const currency = await DeviceStorage.getItem(Keys.MONETARY_UNIT) || CurrencyConfig.CNY;
    this.props.saveUserInfo({ language, currency });

    const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
    this.props.saveUserInfo({ isAgreeInfo: isAgree });

    const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
    this.props.saveUserInfo({ isLoginInfo: isLogin });

    this.props.getConfigRequest();

    this.props.gethInit();
    if (!isLogin) return;

    const address = await DeviceStorage.getItem(Keys.WALLET_ADDRESS) || '';
    this.props.getUserInfoRequest({ address });
  }

  render() {
    return (
      <View style={styles.applicationView}>
        <StatusBar barStyle="light-content" />
        <ReduxNavigation />
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    config: { locale }
  } = state;
  return { locale };
};

const mapDispatchToProps = (dispatch) => ({
  getUserInfoRequest: (params) => dispatch(UserActions.getUserInfoRequest(params)),
  getInjectScript: () => dispatch(UserActions.getInjectScript()),
  getConfigRequest: () => dispatch(ConfigActions.getConfigRequest()),
  saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
  gethInit: () => dispatch(WalletActions.gethInit())
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);

