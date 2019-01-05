import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import ReduxPersist from '../Config/ReduxPersist';
import styles from './Styles/RootContainerStyles';

import WalletActions from '../Redux/WalletRedux';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';

import UserActions from '../Redux/UserRedux';
import ConfigActions from '../Redux/ConfigRedux';
import {LanguageConfig, CurrencyConfig} from '../Config/MineConfig';

class RootContainer extends Component {

  _initializes= async ()=>{
      const language = await DeviceStorage.getItem(Keys.MONETARY_UNIT) || LanguageConfig.zh;
      const currency = await DeviceStorage.getItem(Keys.LANGUAGE_ENVIRONMENT) || CurrencyConfig.CNY;
      this.props.saveUserInfo({language, currency});

      const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
      this.props.saveUserInfo({isLoginInfo:isLogin});
      const rawurl = 'ws://rinkeby03.milewan.com:8546';
      this.props.gethInit({isLogin, rawurl});
      if (!isLogin) return;

      const address = await DeviceStorage.getItem(Keys.WALLET_ADDRESS) || '';
      this.props.getUserInfoRequest({address});
      this.props.getConfigRequest();

      const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
      this.props.saveUserInfo({isAgreeInfo:isAgree});
  }

  componentDidMount  () {
      this._initializes();
      if (!ReduxPersist.active) {
          this.props.startup();
      }

  }

  render () {
      return (
          <View style={styles.applicationView}>
              <StatusBar barStyle='light-content' />
              <ReduxNavigation />
          </View>
      );
  }
}

const mapStateToProps = (state) =>state;

const mapDispatchToProps = (dispatch) => ({
    getUserInfoRequest: (params) => dispatch(UserActions.getUserInfoRequest(params)),
    getConfigRequest: () => dispatch(ConfigActions.getConfigRequest()),
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
    gethInit: (params) => dispatch(WalletActions.gethInit(params)),




    startup: () => dispatch(StartupActions.startup()),
    saveAddress: (params) => dispatch(WalletActions.saveAddress(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
