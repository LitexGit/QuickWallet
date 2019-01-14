import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import styles from './Styles/RootContainerStyles';

import WalletActions from '../Redux/WalletRedux';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';

import UserActions from '../Redux/UserRedux';
import ConfigActions from '../Redux/ConfigRedux';
import {LanguageConfig, CurrencyConfig} from '../Config/MineConfig';

import Layer2Module from '../Lib/NativeBridge/Layer2Module';
import Config from 'react-native-config';

class RootContainer extends Component {

  _initLayer2 = async ()=>{
      const address = '0xb5538753F2641A83409D2786790b42aC857C5340';
      const pnAddress = '0x833f4fc95ebdb9a9628afb8475d797f2b2df6a486a6cfb3b7a0ac525db972678';
      const amount = '1000';
      const msg = 'msg';

      const data001 = await Layer2Module.initL2SDK({address, socketUrl:Config.SOCKET_URL});
      Layer2Module.watchEvents=(event)=>{
          console.log('===========event=========================');
          console.log(event);
          console.log('===========event=========================');
      };
      const data002 = await Layer2Module.addPN({pnAddress});
      const data003 = await Layer2Module.deposit({pnAddress, amount});
      const data004 = await Layer2Module.withdraw({pnAddress, amount});
      const data005 = await Layer2Module.forceLeavePN({pnAddress});
      const data006 = await Layer2Module.sendMsg({msg, pnAddress, amount});
      const data007 = await Layer2Module.queryUserInfo({pnAddress});
      const data008 = await Layer2Module.queryTransaction({pnAddress});
      const data009 = await Layer2Module.queryPN();

      console.log('=============data001=======================');
      console.log(data001);
      console.log('=============data002=======================');
      console.log(data002);
      console.log('=============data003=======================');
      console.log(data003);
      console.log('=============data004=======================');
      console.log(data004);
      console.log('=============data005=======================');
      console.log(data005);
      console.log('=============data006=======================');
      console.log(data006);
      console.log('=============data007=======================');
      console.log(data007);
      console.log('=============data008=======================');
      console.log(data008);
      console.log('=============data009=======================');
      console.log(data009);
  }

  _initializes= async ()=>{
      this.props.getInjectScript();

      const language = await DeviceStorage.getItem(Keys.LANGUAGE_ENVIRONMENT) || LanguageConfig.zh;
      const currency = await DeviceStorage.getItem(Keys.MONETARY_UNIT) || CurrencyConfig.CNY;
      this.props.saveUserInfo({language, currency});

      const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
      this.props.saveUserInfo({isLoginInfo:isLogin});

      this.props.gethInit();
      if (!isLogin) return;

      const address = await DeviceStorage.getItem(Keys.WALLET_ADDRESS) || '';
      this.props.getUserInfoRequest({address});
      this.props.getConfigRequest();

      const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
      this.props.saveUserInfo({isAgreeInfo:isAgree});
  }

  componentDidMount  () {
      this._initializes();
      this._initLayer2();
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
    getInjectScript: () => dispatch(UserActions.getInjectScript()),
    getConfigRequest: () => dispatch(ConfigActions.getConfigRequest()),
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
    gethInit: () => dispatch(WalletActions.gethInit()),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
