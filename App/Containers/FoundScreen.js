import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { Metrics } from '../Themes';
import Swiper from 'react-native-swiper';
import SearchBar from '../Components/SearchCompont';
import styles from './Styles/FoundScreenStyle';
import { NavigationActions } from 'react-navigation';
import FoundActions from '../Redux/FoundRedux';
import {isValidUrl} from '../Lib/Utils';
import Toast from 'react-native-root-toast';

class FoundScreen extends Component {
  static navigationOptions = {
      tabBarLabel: I18n.t('FoundTabBarLabel'),
      tabBarIcon: ({tintColor}) => (
          <Material name={'cube-outline'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  constructor(props) {
      super(props);
      this.state = {
          webLink:'',
      };
  }

  componentDidMount=()=>{
      this.props.getBanner();
      this.props.getApps();
  }

  _onChangeText=(text)=>{
      this.setState({
          webLink:text,
      });
  }

  _onPressScan=()=>{
      this.props.navigate('ScanScreen',{
          callback:(params)=>{
              const {data=''} = params;
              this.setState({
                  webLink:data,
              },()=>{
                  // TODO 003: Url 合法校验 ==> 自动打开链接
              });
          }
      });
  }

  _onSubmitEditing=()=>{
      const {webLink:url} = this.state;
      if (!isValidUrl(url)) {
          Toast.show(I18n.t('InvalidUrlError'), {
              shadow:true,
              position: Toast.positions.CENTER,
          });
          return;
      }
      // layer2
      this.props.navigate('Layer2WebScreen', {url, title:''});
  }

  _onPressBanner = (item)=>{
      const {Url:url} = item;
      this.props.navigate('WebViewScreen', {url});
  }

  _onPressItem = (item)=>{
      const {Url:url, Name:title} = item;
      this.props.navigate('Layer2WebScreen', {url, title});
  }

  _renderBanner = (item,key)=>{
      const {Image:image_url=''} = item;
      return (
          <TouchableOpacity key={key} style={styles.banner} onPress={()=>this._onPressBanner(item)}>
              <Image style={styles.banner} source={{ uri: image_url }}/>
          </TouchableOpacity>
      );
  }

  _renderItem = (item,key)=>{
      const {Icon:icon='', Name:name=''} = item;
      return (
          <TouchableOpacity key={key} style={styles.itemBack}  onPress={()=>this._onPressItem(item)}>
              <View style={styles.itemStyle}>
                  <Image style={styles.imageItem} source={{ uri: icon }} />
                  <Text style={styles.titleItem}>{name}</Text>
              </View>
          </TouchableOpacity>
      );
  }

  render () {
      const {bannerList, appList} = this.props;
      const {webLink} = this.state;

      const  swiper = (
          <Swiper key={bannerList.length} autoplay loop showsPagination>
              { !!bannerList && bannerList.map((item, i) => this._renderBanner(item, i)) }
          </Swiper>
      );

      return (
          <View style={styles.container}>
              <View style={styles.topSection}>
                  {swiper}
              </View>
              <View style={styles.searchBar}>
                  <SearchBar
                      ref={(ref)=>this.searchBar = ref}
                      setValue={webLink}
                      onChangeText={(text)=>this._onChangeText(text)}
                      onPressScan={this._onPressScan}
                      onSubmitEditing={this._onSubmitEditing}/>
              </View>
              <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.contentContainer}>
                  {!!appList && appList.map((item, i) => this._renderItem(item, i))}
              </ScrollView>
          </View>

      );
  }
}

const mapStateToProps = (state) =>{
    const {found:{bannerList, appList}} = state;
    return { bannerList, appList};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    getBanner: () => dispatch(FoundActions.getBannerRequest()),
    getApps: () => dispatch(FoundActions.getAppsRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoundScreen);



// // https://reactnavigation.org/docs/en/stack-actions.html#reset 无效
// _resetRoot=async()=>{
//     const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
//     const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
//     const isMount = await DeviceStorage.getItem(Keys.IS_NEW_SCREEN_DID_MOUNT) || false;

//     if (!isLogin && !isAgree && isMount) {
//         this.props.navigate.dispatch(StackActions.reset({
//             index: 0,
//             actions: [
//                 NavigationActions.navigate({ routeName: 'NewWalletScreen'}),
//                 // NavigationActions.navigate({ routeName: 'Layer2WebScreen'}),
//                 // NavigationActions.navigate({ routeName: 'BottomTab'})
//             ]
//         }));
//     }
// };
