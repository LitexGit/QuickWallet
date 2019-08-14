import React, { Component } from 'react';
import { ScrollView, Text, View, TouchableOpacity, Image} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { Metrics } from '../Themes';
import Swiper from 'react-native-swiper';
import SearchView from '../Components/SearchView';
import styles from './Styles/FoundScreenStyle';
import { NavigationActions, NavigationEvents } from 'react-navigation';
import FoundActions from '../Redux/FoundRedux';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import { checkUrl } from '../Lib/Format'

class FoundScreen extends Component {
  static navigationOptions = ({navigation}) => {
      return {
        tabBarLabel: navigation.getParam('tabBarLabel'),
        tabBarIcon: ({tintColor}) => (
            <Material name={'cube-outline'}
                size={Metrics.bottomTabIconSize}
                color={tintColor}
            />
        )
      }
  }
  constructor(props) {
      super(props);
      this.state = {
          scanInfo:''
      };
  }

  componentDidMount= ()=>{
    this.props.getBanner();
    this.props.getApps();
    this._updateTitle();
  }

  _updateTitle= async ()=>{
    const language = await DeviceStorage.getItem(Keys.LANGUAGE_ENVIRONMENT) || LanguageConfig.zh;
    const {locale = 'zh'} = language;
    I18n.locale = locale;
    this.props.navigation.setParams({
      tabBarLabel: I18n.t('FoundTabBarLabel')
    });
  }

  _onPressScan=()=>{
    let accept = true;
    this.props.navigate('ScanScreen',{
        callback:(params)=>{
            if (!accept) return
            accept = false
            const {data=''} = params;
            this.setState({
              scanInfo:data
            },()=>{
              const {scanInfo} = this.state;
              if (checkUrl(scanInfo)) {
                this.props.navigate('Layer2WebScreen', {url:scanInfo});
              } else {
                this.props.navigate('SearchListScreen', {url:scanInfo, valid:false})
              }
            });
        }
    });
  }

  _onPressBanner = (item)=>{
      const {Url:url} = item;
      this.props.navigate('WebViewScreen', {url});
  }

  _onPressItem = (item)=>{
      const {Name:title, Url:url} = item;
      console.log('=========_onPressItem===========================');
      console.log(url);
      console.log('==========_onPressItem==========================');
      // const url = 'http://192.168.51.230:8080/#/';
      // const url = 'http://192.168.51.230:8082/#/';
      // const url = 'https://pkt.red/#/';
      this.props.navigate('Layer2WebScreen', {url, title});
  }

  _renderBanner = (item,key)=>{
      const {Image:image_url=''} = item;
      return (
          <TouchableOpacity key={key}
              style={styles.banner}
              onPress={()=>this._onPressBanner(item)}
          >
              <Image style={styles.banner}
                  source={{ uri: image_url }}
              />
          </TouchableOpacity>
      );
  }

  _renderItem = (item,key)=>{
      const {Icon:icon='', Name:name=''} = item;
      return (
          <TouchableOpacity key={key}
              style={styles.itemBack}
              onPress={()=>this._onPressItem(item)}
          >
              <View style={styles.itemStyle}>
                  <Image style={styles.imageItem}
                      source={{ uri: icon }}
                  />
                  <Text style={styles.titleItem}>{name}</Text>
              </View>
          </TouchableOpacity>
      );
  }

  render () {
      const {bannerList, appList} = this.props;

      const  swiper = (
          <Swiper key={bannerList.length}
              autoplay
              loop
              showsPagination
          >
              {!!bannerList && bannerList.map((item, i) => this._renderBanner(item, i))}
          </Swiper>
      );

      return (
          <View style={styles.container}>
              <NavigationEvents onDidFocus={()=> this._updateTitle()}/>
              <View style={styles.topSection}>
                  {swiper}
              </View>
              <View style={[styles.search, {backgroundColor:''}]}>
                <SearchView onPressScan={this._onPressScan}
                    onPressSearch={()=>this.props.navigate('SearchListScreen', {url:''})}
                />
              </View>
              <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.contentContainer}
              >
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
    getApps: () => dispatch(FoundActions.getAppsRequest())
});

export default connect(mapStateToProps, mapDispatchToProps)(FoundScreen);

