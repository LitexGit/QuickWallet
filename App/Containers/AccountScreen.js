import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button, Avatar } from 'react-native-elements';
import styles from './Styles/AccountScreenStyle';
import { View } from 'react-native-animatable';
import {AccountConfig} from '../Config/MineConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Metrics , Colors } from '../Themes';

class AccountScreen extends Component {
  static navigationOptions = {
      title:'我的账户',
  }
  _onPressBackup=()=>{

  }

  _onPressLogOut=()=>{

  }

  _onPressCopy=()=>{

  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  render () {
      const settings = {'avatar':'', 'account':'1号', 'inviteCode':'2b4a4'};
      const avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg';
      const address = '0xdadadadadmdafnanjadnajanddadad';


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
              <View style={styles.topSection}>
                  {infoView}
              </View>
              <View style={styles.centerSection}>
                  <View style={styles.addressSection}>
                      <Text style={styles.address} numberOfLines={1}>{address}</Text>
                      <TouchableOpacity onPress={()=>this._onPressCopy}>
                          <FontAwesome name={'copy'} size={Metrics.icons.small} color={Colors.textColor}/>
                      </TouchableOpacity>
                  </View>
                  <View></View>
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

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountScreen);
