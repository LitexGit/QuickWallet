import React, { Component } from 'react';
import styles from './Styles/MineComponentStyle';
import { FlatList, Text, TouchableOpacity, Image, Share, Platform, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Metrics, Colors } from '../Themes';
import { View } from 'react-native-animatable';
import { MineConfig } from '../Config/MineConfig';
import Config from 'react-native-config';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';

import { NavigationActions, NavigationEvents } from 'react-navigation';
import UserActions from '../Redux/UserRedux';
import Identicon from 'identicon.js';
import I18n from '../I18n';
import { toFixed } from '../Lib/Format';
import AssetActions from '../Redux/AssetRedux';
import {getMineConfigTitle} from '../Lib/Transfer';

class MineComponent extends Component {

  componentDidMount = () => {
    const { address } = this.props;
    this.props.getUserInfo({ address });
    this.props.getTokenList()
  }

  _onPressHelper = () => {
    const telegroup = Config.TELEGRAM_GROUP;
    Linking.canOpenURL(telegroup)
      .then((supported) => {
        console.log('supported===>'+supported);
        return Linking.openURL(telegroup);
      }).catch((err) => console.log(err));
  }

  _onPressShare = () => {
    const shareUrl = Config.SHARE_URL;
    const { sharecode = '' } = this.props;
    let shareParams = {};
    if (Platform.OS === 'ios') {
      const url = shareUrl + '?sharecode=' + sharecode;
      shareParams = { url };
    } else {
      const message = shareUrl + '?sharecode=' + sharecode;
      shareParams = { message };
    }
    Share.share(shareParams);
  };

  _onPressItem = (key) => {
    const { navigate } = this.props;
    switch (key) {
      case MineConfig.setting.key:
        navigate('SettingScreen');
        break;
      case MineConfig.help.key:
        this._onPressHelper();
        break;
      case MineConfig.agreement.key:
        break;
      case MineConfig.share.key:
        this._onPressShare();
        break;
      default:
        break;
    }

  }

  _renderItem = ({ item }) => {
    const { key = '', isNext = false } = item;
    const nextImg = isNext ? (<View>
      <MaterialIcons color={Colors.textColor}
          name={'navigate-next'}
          size={Metrics.icons.medium}
      />
    </View>) : null;
    let typeImg = null;
    switch (key) {
      case MineConfig.setting.key:
        typeImg = <AntDesign color={Colors.textColor}
            name={'setting'}
            size={Metrics.icons.small}
                  />;
        break;
      case MineConfig.help.key:
        typeImg = <MaterialCommunityIcons color={Colors.textColor}
            name={'headset'}
            size={Metrics.icons.small}
                  />;
        break;
      case MineConfig.agreement.key:
        typeImg = <Entypo color={Colors.textColor}
            name={'feather'}
            size={Metrics.icons.small}
                  />;
        break;
      case MineConfig.share.key:
        typeImg = <AntDesign color={Colors.textColor}
            name={'sharealt'}
            size={Metrics.icons.small}
                  />;
        break;
      default:
        break;
    }

    return (<TouchableOpacity onPress={() => this._onPressItem(key)}>
      <View style={styles.itemContainer}>
        <View style={styles.itemLeft}>
          {typeImg}
          <Text style={styles.titleColor}>{getMineConfigTitle(key)}</Text>
        </View>
        {nextImg}
      </View>
    </TouchableOpacity>);
  }

  _renderItemSeparator = () => <View style={styles.itemSeparator} />

  render() {
    const { nickname, address, tokenList = [], currency } = this.props;
    const { symbol } = currency;
    let banance = 0;
    for (const token of tokenList) {
      const { count, Rate: rate } = token;
      banance += count * rate;
    }

    const avatar = new Identicon(address).toString();
    const avatar_64 = 'data:image/png;base64,' + avatar;

    const data = Object.values(MineConfig);
    return (
      <View style={styles.container}>
        <NavigationEvents onDidFocus={()=> this.props.updateBalance()}/>
        <View style={styles.topSection}>
          <TouchableOpacity onPress={() => this.props.navigate('AccountScreen')}
              style={styles.avatarSection}
          >
            <View style={styles.avatarSection}>
              <Image source={{ uri: avatar_64 }}
                  style={styles.avatar}
              />
              <Text style={styles.nameText}>{nickname}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.props.navigate('AssetsScreen')}
              style={styles.assetsSection}
          >
            <Text style={styles.assetsStyle}>{I18n.t('AssetsValue')} {symbol} {toFixed(banance)}</Text>
          </TouchableOpacity>

        </View>
        <View style={styles.bottomSection}>
          <FlatList
              data={data}
              ItemSeparatorComponent={this._renderItemSeparator}
              keyExtractor={(item, index) => '' + index}
              renderItem={this._renderItem}
              style={styles.flatList}
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const {
    user: { nickname='', address='12345678900987654321', sharecode='', currency },
    assets: { tokenList }
  } = state;
  return { nickname, address, sharecode, currency, tokenList };
};

const mapDispatchToProps = (dispatch) => ({
  navigate: (route) => dispatch(NavigationActions.navigate({ routeName: route })),
  getUserInfo: (params) => dispatch(UserActions.getUserInfoRequest(params)),
  getTokenList: () => dispatch(AssetActions.getTokenListRequest()),
  updateBalance: () => dispatch(AssetActions.updateBalance())
});

export default connect(mapStateToProps, mapDispatchToProps)(MineComponent);
