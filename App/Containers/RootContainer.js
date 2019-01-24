import React, { Component } from 'react';
import { View, StatusBar, Text} from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import styles from './Styles/RootContainerStyles';

import WalletActions from '../Redux/WalletRedux';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';

import UserActions from '../Redux/UserRedux';
import ConfigActions from '../Redux/ConfigRedux';
import {LanguageConfig, CurrencyConfig} from '../Config/MineConfig';
import {Preferences, PrefKeys} from '../Lib/Preferences';

class RootContainer extends Component {

  constructor(props){
    super(props);
    this.state = { realm: null };
  }

  _initializes= async ()=>{
      this.props.getInjectScript();

      const language = Preferences.getPrefsObjectBy(PrefKeys.LANGUAGE_ENVIRONMENT) || LanguageConfig.zh;
      const currency = await DeviceStorage.getItem(Keys.MONETARY_UNIT) || CurrencyConfig.CNY;
      this.props.saveUserInfo({language, currency});

      const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
      this.props.saveUserInfo({isAgreeInfo:isAgree});

      const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
      this.props.saveUserInfo({isLoginInfo:isLogin});

      this.props.getConfigRequest();

      this.props.gethInit();
      if (!isLogin) return;

      const address = await DeviceStorage.getItem(Keys.WALLET_ADDRESS) || '';
      this.props.getUserInfoRequest({address});
  }

  componentDidMount  () {
      this._initializes();
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

const mapStateToProps = (state) =>{
    const {
        config:{locale}
    } = state;
    return {locale};
};

const mapDispatchToProps = (dispatch) => ({
    getUserInfoRequest: (params) => dispatch(UserActions.getUserInfoRequest(params)),
    getInjectScript: () => dispatch(UserActions.getInjectScript()),
    getConfigRequest: () => dispatch(ConfigActions.getConfigRequest()),
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
    gethInit: () => dispatch(WalletActions.gethInit()),
});

export default connect(mapStateToProps,mapDispatchToProps)(RootContainer);



// _initLayer2 = async ()=>{

//   const cpKey = 'HDNQOXNWALXMIWNCBHD';
//   const address = '0xb5538753F2641A83409D2786790b42aC857C5340';
//   const socketUrl = 'www.baidu.com';

//   Layer2Module.initL2SDK(cpKey,  address, socketUrl,(data)=>{

//       console.log('====================================');
//       console.log(data);
//       console.log('====================================');
//   });


//   const command = 'HDNQOXNWALXMIWNCBHD';
//   const params = {
//       pnAddress:'0xb5538753F2641A83409D2786790b42aC857C5340 0xb5538753F2641A83409D2786790b42aC857C5340',
//       amount:'10000'
//   };
//   const body = JSON.stringify(params);

//   Layer2Module.call(command, body, (data)=>{
//       console.log('====================================');
//       console.log(data);
//       console.log('====================================');
//   });

// }
