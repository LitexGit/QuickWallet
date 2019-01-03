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

class RootContainer extends Component {

  _initializes= async ()=>{
      const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
      if (!isLogin) return;
      const address = await DeviceStorage.getItem(Keys.WALLET_ADDRESS) || '';
      this.props.getUserInfoRequest({address});
      this.props.getConfigRequest();







      // const {gethInit, saveUserInfo, saveAddress} = this.props;
      //
      // saveAddress({address});
      // const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
      // saveUserInfo({isAgreeInfo:isAgree});

      //
      // saveUserInfo({isLoginInfo:isLogin});
      // const rawurl = 'ws://rinkeby03.milewan.com:8546';
      // gethInit({isLogin, rawurl});
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

const mapStateToProps = (state) => {
    console.log('=========state===========================');
    console.log(state);
    console.log('=========state===========================');
    return state;
};

const mapDispatchToProps = (dispatch) => ({
    getUserInfoRequest: (params) => dispatch(UserActions.getUserInfoRequest(params)),
    getConfigRequest: () => dispatch(ConfigActions.getConfigRequest()),






    startup: () => dispatch(StartupActions.startup()),
    gethInit: (params) => dispatch(WalletActions.gethInit(params)),
    saveAddress: (params) => dispatch(WalletActions.saveAddress(params)),
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
