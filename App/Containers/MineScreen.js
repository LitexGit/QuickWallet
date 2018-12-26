import React, { Component } from 'react';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics , Colors } from '../Themes';
import styles from './Styles/MineScreenStyle';
import { View } from 'react-native-animatable';
import {MineConfig} from '../Config/MineConfig';

import { Avatar } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import { NavigationActions } from 'react-navigation';
import UserActions from '../Redux/UserRedux';
import AssetActions from '../Redux/AssetRedux';

class MineScreen extends Component {
  static navigationOptions = {
      tabBarIcon: ({tintColor}) => (
          <Ionicons name={'md-person'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  componentDidMount=()=>{
      const address = '0x38bCc5B8b793F544d86a94bd2AE94196567b865c';
      const {getUserInfo, getBalance} = this.props;
      // getUserInfo(address);
      // getBalance({address});
  }

  _onPressAvatar=()=>{
      this.props.navigate('AccountScreen');
  }

  _onPressAssets=()=>{
      this.props.navigate('AssetsScreen');
  }

  _onPressItem=(key)=>{
      const {navigate} = this.props;
      switch (key) {
      case MineConfig.setting.key:
          navigate('SettingScreen');
          break;
      case MineConfig.help.key:

          break;
      case MineConfig.agreement.key:

          break;
      case MineConfig.about.key:

          break;
      case MineConfig.share.key:

          break;
      default:
          break;
      }

  }

  _renderItem=({item})=>{
      const {key='', title='', isNext=false} = item;
      const nextImg = isNext ? (<View>
          <MaterialIcons name={'navigate-next'} size={Metrics.icons.medium} color={Colors.textColor}/>
      </View>) : null;
      let typeImg = null;
      switch (key) {
      case MineConfig.setting.key:
          typeImg = <AntDesign name={'setting'} size={Metrics.icons.small} color={Colors.textColor}/>;
          break;
      case MineConfig.help.key:
          typeImg = <MaterialCommunityIcons name={'headset'} size={Metrics.icons.small} color={Colors.textColor}/>;
          break;
      case MineConfig.agreement.key:
          typeImg = <Entypo name={'feather'} size={Metrics.icons.small} color={Colors.textColor}/>;
          break;
      case MineConfig.about.key:
          typeImg = <MaterialCommunityIcons name={'clover'} size={Metrics.icons.small} color={Colors.textColor}/>;
          break;
      case MineConfig.share.key:
          typeImg = <AntDesign name={'sharealt'} size={Metrics.icons.small} color={Colors.textColor}/>;
          break;
      default:
          break;
      }

      return ( <TouchableOpacity onPress={()=>this._onPressItem(key)}>
          <View style={styles.itemContainer}>
              <View style={styles.itemLeft}>
                  {typeImg}
                  <Text style={styles.titleColor}>{title}</Text>
              </View>
              {nextImg}
          </View>
      </TouchableOpacity>);
  }

  _renderItemSeparator= ()=><View style={styles.itemSeparator}/>

  render () {
      const avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg';
      const name = '1号';
      const assets = '资产总价值：￥100.00';
      const data = Object.values(MineConfig);

      return (
          <View style={styles.container}>
              <View style={styles.topSection}>
                  <TouchableOpacity style={styles.avatarSection} onPress={()=>this._onPressAvatar()}>
                      <View style={styles.avatarSection}>
                          <Avatar medium rounded
                              containerStyle={styles.avatar}
                              source={{uri: avatar_url}}
                              onPress={() => console.log('Works!')}
                              activeOpacity={0.7}/>
                          <Text style={styles.nameText}>{name}</Text>
                      </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.assetsSection} onPress={()=>this._onPressAssets()}>
                      <View style={styles.assetsSection}>
                          <Text style={styles.assetsStyle}>{assets}</Text>
                      </View>
                  </TouchableOpacity>

              </View>
              <View style={styles.bottomSection}>
                  <FlatList
                      style={styles.flatList}
                      data={data}
                      keyExtractor={(item,index)=>''+index}
                      renderItem={ this._renderItem }
                      ItemSeparatorComponent = {this._renderItemSeparator}
                  />
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        assets:{ethBanance}
    } = state;
    return { ethBanance };
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    getUserInfo: (params) => dispatch(UserActions.getUserInfoRequest(params)),
    getBalance: (params) => dispatch(AssetActions.getBalanceRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
