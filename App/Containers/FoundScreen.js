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

class FoundScreen extends Component {
  static navigationOptions = {
      tabBarLabel: I18n.t('FoundTabBarLabel'),
      tabBarIcon: ({tintColor}) => (
          <Material name={'cube-outline'}
              size={Metrics.bottomTabIconSize}
              color={tintColor}
          />
      )
  }

  constructor(props) {
      super(props);
      this.state = {
          webLink:''
      };
  }

  componentDidMount=()=>{
      this.props.getBanner();
      this.props.getApps();
  }

  _onChangeText=(text)=>{
      this.setState({
          webLink:text
      });
  }

  _onPressScan=()=>{
      this.props.navigate('ScanScreen',{
          callback:(params)=>{
              const {data=''} = params;
              this.setState({
                  webLink:data
              },()=>{
                  // TODO 003: Url 合法校验 ==> 自动打开链接
              });
          }
      });
  }

  _onSubmitEditing=()=>{
      const {webLink:url} = this.state;
      console.log('=========_onSubmitEditing===========================');
      console.log(url);
      console.log('=========_onSubmitEditing===========================');
      this.props.navigate('Layer2WebScreen', {url, title:''});
  }

  _onPressBanner = (item)=>{
      const {Url:url} = item;
      console.log('=========_onPressBanner===========================');
      console.log(url);
      console.log('==========_onPressBanner==========================');
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
      const {webLink} = this.state;

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
              <View style={styles.topSection}>
                  {swiper}
              </View>
              <View style={styles.searchBar}>
                  <SearchBar
                      ref={(ref)=>this.searchBar = ref}
                      setValue={webLink}
                      onChangeText={(text)=>this._onChangeText(text)}
                      onPressScan={this._onPressScan}
                      onSubmitEditing={this._onSubmitEditing}
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

