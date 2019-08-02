import React, { Component } from 'react';
import {Text, TouchableOpacity, Clipboard, Alert, TextInput} from 'react-native';
import { connect } from 'react-redux';
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
import  Identicon from 'identicon.js';
import { Avatar } from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import {getAccountConfigTitle} from '../Lib/Transfer'

class AccountScreen extends Component {
  static navigationOptions = () => {
      return {
        title:I18n.t('AccountTabTitle'),
        backgroundColor: 'red'
      }
  }

  constructor(props){
      super(props);
      this.state={
          isInit:false
      };
  }

  componentDidMount=()=>{
      this.props.setLoading({loading:false});
  }

  componentWillUnmount=()=>{
  }

  _onPressCancel=()=>{
      this.setState({ isInit:false });
  }
  _onPressConfirm=(passphrase)=>{
      this.setState({ isInit:false });
      this.props.gethExportPrivateKey({passphrase});
  }

  _onPressBackup=()=>{
      this.setState({ isInit:true });
  }

  _onPressConfirmLogout=()=>this.props.logout();

  _onPressPreConfirmLogout=()=>{
      Alert.alert( I18n.t('LogoutTitle'),  I18n.t('LogoutRemind'),
          [{text: I18n.t('CancelAction'), style: 'cancel'}, {text: I18n.t('ConfirmAction'), onPress: () => this._onPressConfirmLogout()}],
          { cancelable: false }
      );
  };

  _onPressLogOut=()=>{
      Alert.alert( I18n.t('LogoutTitle'),  I18n.t('PreLogoutRemind'),
          [{text: I18n.t('CancelAction'), style: 'cancel'}, {text: I18n.t('ConfirmAction'), onPress: () => this._onPressPreConfirmLogout()}],
          { cancelable: false }
      );
  }

  _onPressCopy=()=>{
      const { address } = this.props;
      Clipboard.setString(address);
      Toast.show(I18n.t('AddressCopied'), {
          shadow:true,
          position: Toast.positions.CENTER
      });
  }

  _onSubmitEditing= (event)=>{
      const {address} = this.props;
      const nickname = event.nativeEvent.text;
      this.props.register({address, nickname});
  }

  render () {

      const {isInit} = this.state;
      const {nickname, sharecode, loading} = this.props;
      let {address=''} = this.props;
      if (!address || address.length < 15) {
          address= '123456789012345';
      }
      const settings = {'avatar':address, 'account': nickname, 'inviteCode':sharecode};

      const avatar = new Identicon(address).toString();
      const avatar_64='data:image/png;base64,'+avatar;

      const infoView = Object.values(AccountConfig).map((config, index)=>{
          const { key='' } = config;
          config.details = settings[key];
          const { details='', index:itemIndex=0 } = config;
          let rightView = null;
          switch (itemIndex) {
          case 0:
              rightView = (<Avatar small
                  rounded
                  source={{uri: avatar_64}}
                           />);
              break;
          case 1:
              rightView = (<TextInput style={styles.textInput}
                  defaultValue={details}
                  underlineColorAndroid="transparent"
                  blurOnSubmit
                  onSubmitEditing={this._onSubmitEditing}
                           />);
              break;
          case 2:
              rightView = (<Text style={styles.detailsStyle}>{details}</Text>);
              break;

          default:
              break;
          }

          return (<View key={index}
              style={styles.itemView}
                  >
              <Text style={styles.titleStyle}>{getAccountConfigTitle(key)}</Text>
              {rightView}
          </View>);
      });

      return (
          <View style={styles.container}>
              <Spinner visible={loading}
                  cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}
              />
              <PassphraseInputAlert isInit={isInit}
                  onPressCancel={()=>this._onPressCancel()}
                  onPressConfirm={(password)=>this._onPressConfirm(password)}
              />
              <View style={styles.topSection}>
                  {infoView}
              </View>
              <View style={styles.centerSection}>
                  <View style={styles.addressSection}>
                      <Text style={styles.address}
                          numberOfLines={1}
                      >{address}</Text>
                      <TouchableOpacity onPress={()=>this._onPressCopy()}>
                          <FontAwesome name={'copy'}
                              size={Metrics.icons.small}
                              color={Colors.textColor}
                          />
                      </TouchableOpacity>
                  </View>
                  <QRCode value={address}
                      size={120}
                  />
              </View>
              <View style={styles.bottomSection}>
                  <TouchableOpacity style={styles.buttonStyle}
                      onPress={()=>this._onPressBackup()}
                  >
                      <Text style={styles.backupTitle}>{I18n.t('BackUpAccount')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonStyle}
                      onPress={()=>this._onPressLogOut()}
                  >
                      <Text style={styles.logOutTitle}>{I18n.t('LogoutAction')}</Text>
                  </TouchableOpacity>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{loading},
        user:{nickname, sharecode, address}
    } = state;
    return {address, nickname, sharecode, loading};
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (params) => dispatch(WalletActions.setLoading(params)),
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    logout: () => dispatch(UserActions.logout()),
    gethExportPrivateKey: (params) => dispatch(WalletActions.gethExportPrivateKey(params)),
    register:(params)=>dispatch(UserActions.registerRequest(params))

});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
