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
  }

  _onPressCancel=()=>{
      this.setState({ isInit:false });
  }
  _onPressConfirm=(passphrase)=>{
      this.setState({ isInit:false });
      // TODO 验证密码是否有效
      this.props.gethUnlockAccount({passphrase});
      // 判断解锁后
      this.props.navigate('ExportScreen', {passphrase});
  }

  _onPressBackup=()=>{
      this.setState({ isInit:true });
  }


  _confirmBtnAction=()=>this.props.logout();

  _onPressLogOut=()=>{
      const title = '退出当前身份';
      const content = '即将移除身份及所有导入的钱包，请确保所有钱包已备份。';
      const action001 = '取消';
      const action002 = '确认';

      Alert.alert( title,content,
          [{text: action001, style: 'cancel'}, {text: action002, onPress: () => this._confirmBtnAction()}],
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

      const avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg';

      const {isInit} = this.state;
      const {address, nickname, sharecode} = this.props;
      const settings = {'avatar':'', 'account': nickname, 'inviteCode':sharecode};

      const infoView = Object.values(AccountConfig).map((config, index)=>{
          const { key='' } = config;
          config.details = settings[key];
          const { title='', type=1, details='' } = config;

          const rightView = type === 1 ? <Avatar small rounded source={{uri: avatar_url}}/> : <Text style={styles.detailsStyle}>{details}</Text>;

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
                  <QRCode value={avatar_url} size={120}/>
              </View>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBackup()}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.backupTitle}
                      title='备份此账户'/>
                  <Button onPress={()=>this._onPressLogOut()}
                      buttonStyle={styles.buttonStyle}
                      textStyle={styles.logOutTitle}
                      title='退出登录'/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{address},
        user:{nickname, sharecode}
    } = state;
    return {address, nickname, sharecode};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
    logout: () => dispatch(UserActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
