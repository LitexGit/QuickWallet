import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import styles from './Styles/RootContainerStyles';

import AssetActions from '../Redux/AssetRedux';
import WalletActions from '../Redux/WalletRedux';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';

import UserActions from '../Redux/UserRedux';
import ConfigActions from '../Redux/ConfigRedux';
import { LanguageConfig, CurrencyConfig } from '../Config/MineConfig';
import I18n from '../I18n';


class RootContainer extends Component {

  async componentDidMount() {
    this.props.gethInit();

    this.props.getConfigRequest();
    this.props.getInjectScript();

    const language = await DeviceStorage.getItem(Keys.LANGUAGE_ENVIRONMENT) || LanguageConfig.zh;
    const {locale = 'zh'} = language;
    I18n.locale = locale;

    const currency = await DeviceStorage.getItem(Keys.MONETARY_UNIT) || CurrencyConfig.CNY;
    this.props.saveUserInfo({ currency, language });

    const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
    this.props.saveUserInfo({ isAgreeInfo: isAgree });

    const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
    this.props.saveUserInfo({ isLoginInfo: isLogin });

    const address = await DeviceStorage.getItem(Keys.WALLET_ADDRESS) || '';
    this.props.getUserInfoRequest({ address });
    if (!isLogin) return;
    this.props.getTokenList();
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
  gethInit: () => dispatch(WalletActions.gethInit()),
  getTokenList: () => dispatch(AssetActions.getTokenListRequest())
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);

