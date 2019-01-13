import React, { Component } from 'react';
import {Text, TouchableOpacity, Clipboard, Alert} from 'react-native';
import { connect } from 'react-redux';
import { Button, Avatar } from 'react-native-elements';
import styles from './Styles/AccountScreenStyle';
import { View } from 'react-native-animatable';
import {AccountConfig} from '../Config/MineConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Metrics , Colors } from '../Themes';
import QRCode from 'react-native-qrcode-svg';
import { NavigationActions } from 'react-navigation';
import WalletActions from '../Redux/WalletRedux';
import UserActions from '../Redux/UserRedux';
import I18n from '../I18n';
import PassphraseInputAlert from '../Components/PassphraseInputAlert';
import Toast from 'react-native-root-toast';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import  Identicon from 'identicon.js';


class AccountScreen extends Component {
  static navigationOptions = {
      title:I18n.t('AccountTabTitle'),
      backgroundColor: 'red',
  }

  constructor(props){
      super(props);
      this.state={
          isInit:false,
      };
      this.passphrase = '';
  }

  componentDidMount=()=>{
      this.isUnlockListener = EventEmitter.addListener(EventKeys.IS_UNLOCK_ACCOUNT, ({isUnlock})=>{
          if (isUnlock) {
              const {passphrase=''} = this.props;
              this.props.navigate('ExportScreen', {passphrase});
              return;
          }
          this.props.gethUnlockAccount({passphrase:this.passphrase});
      });
      this.lockListener = EventEmitter.addListener(EventKeys.WALLET_UNLOCKED, ()=>{
          const {passphrase=''} = this.props;
          this.props.navigate('ExportScreen', {passphrase});
      });
  }

  componentWillUnmount=()=>{
      this.lockListener.remove();
      this.isUnlockListener.remove();
  }


  _onPressCancel=()=>{
      this.setState({ isInit:false });
  }
  _onPressConfirm=(passphrase)=>{
      this.passphrase = passphrase;
      this.setState({ isInit:false });
      this.props.gethIsUnlockAccount();
  }

  _onPressBackup=()=>{
      this.setState({ isInit:true });
  }


  _confirmBtnAction=()=>this.props.logout();

  _onPressLogOut=()=>{
      Alert.alert( I18n.t('LogoutTitle'),  I18n.t('LogoutRemind'),
          [{text: I18n.t('CancelAction'), style: 'cancel'}, {text: I18n.t('ConfirmAction'), onPress: () => this._confirmBtnAction()}],
          { cancelable: false }
      );
  }

  _onPressCopy=()=>{
      const { address } = this.props;
      Clipboard.setString(address);
      Toast.show(I18n.t('AddressCopied'), {
          shadow:true,
          position: Toast.positions.CENTER,
      });
  }

  render () {

      const {isInit} = this.state;
      const {address, nickname, sharecode} = this.props;
      const settings = {'avatar':address, 'account': nickname, 'inviteCode':sharecode};

      const avatar = new Identicon(address).toString();
      const avatar_64='data:image/png;base64,'+avatar;

      const infoView = Object.values(AccountConfig).map((config, index)=>{
          const { key='' } = config;
          config.details = settings[key];
          const { title='', type=1, details='' } = config;

          const rightView = type === 1 ? <Avatar small rounded source={{uri: avatar_64}}/> : <Text style={styles.detailsStyle}>{details}</Text>;

          return (<View key={index} style={styles.itemView}>
              <Text style={styles.titleStyle}>{title}</Text>
              {rightView}
          </View>);
      });

      return (
          <View style={styles.container}>
              <PassphraseInputAlert isInit={isInit} onPressCancel={()=>this._onPressCancel()} onPressConfirm={(password)=>this._onPressConfirm(password)}/>
              <View style={styles.topSection}>
                  {infoView}
              </View>
              <View style={styles.centerSection}>
                  <View style={styles.addressSection}>
                      <Text style={styles.address} numberOfLines={1}>{address}</Text>
                      <TouchableOpacity onPress={()=>this._onPressCopy()}>
                          <FontAwesome name={'copy'} size={Metrics.icons.small} color={Colors.textColor}/>
                      </TouchableOpacity>
                  </View>
                  <QRCode value={address} size={120}/>
              </View>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBackup()}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.backupTitle}
                      title={I18n.t('BackUpAccount')}/>
                  <Button onPress={()=>this._onPressLogOut()}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.logOutTitle}
                      title={I18n.t('LogoutAction')}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        user:{nickname, sharecode, address, passphrase}
    } = state;
    return {address, nickname, sharecode, passphrase};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    logout: () => dispatch(UserActions.logout()),
    gethIsUnlockAccount: () => dispatch(WalletActions.gethIsUnlockAccount()),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
