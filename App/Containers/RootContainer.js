import React, { Component } from 'react';
import { View, StatusBar, NativeModules, Platform, NativeEventEmitter} from 'react-native';
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

      await Layer2Module.initL2SDK({address, socketUrl:Config.SOCKET_URL});
      await Layer2Module.addPN({pnAddress});
      await Layer2Module.deposit({pnAddress, amount});
      await Layer2Module.withdraw({pnAddress, amount});
      await Layer2Module.forceLeavePN({pnAddress});
      await Layer2Module.sendMsg({msg, pnAddress, amount});
      await Layer2Module.queryUserInfo({pnAddress});
      await Layer2Module.queryTransaction({pnAddress});
      await Layer2Module.queryPN();

      if (Platform.OS === 'ios') {
          NativeModules.Layer2Module.onWatchEvents((err, data)=>{
              console.log('===========event=========================');
              console.log(data);
          });
      } else {
          NativeModules.Layer2Module.onWatchEvents((data)=>{
              console.log('===========event=========================');
              console.log(data);
          }, (err)=>{
              console.log('===========err=========================');
              console.log(err);
          });
      }


      const layer2EventEmitter = new NativeEventEmitter(NativeModules.Layer2Module);
      this.layer2Listener001 = layer2EventEmitter.addListener('MessageReceived',(reminder) => {
          console.log('==============reminder.name======================');
          console.log(reminder);
          console.log('==============reminder.name======================');
      });
      this.layer2Listener002 = layer2EventEmitter.addListener('Deposit',(reminder) => {
          console.log('==============reminder.name======================');
          console.log(reminder);
          console.log('==============reminder.name======================');
      });
      this.layer2Listener003 = layer2EventEmitter.addListener('Withdraw',(reminder) => {
          console.log('==============reminder.name======================');
          console.log(reminder);
          console.log('==============reminder.name======================');
      });
      this.layer2Listener004 = layer2EventEmitter.addListener('ForceLeavePN',(reminder) => {
          console.log('==============reminder.name======================');
          console.log(reminder);
          console.log('==============reminder.name======================');
      });
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
