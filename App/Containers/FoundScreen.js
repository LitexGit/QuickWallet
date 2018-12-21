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
          <Material name={'cube-outline'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  constructor(props) {
      super(props);
      this.state = {
      };
  }

  componentWillMount=()=>{

  }
  componentDidMount=()=>{
      const {getBanner} = this.props;
      getBanner();
  }

  _onPressBanner = (item)=>{
      const {type, url} = item;
      console.log('type:'+type+'url:'+url);
  }

  _onPressItem = (item)=>{
      console.log('============_onPressItem========================');
      console.log(item);
      console.log('============_onPressItem========================');
  }

  _renderBanner = (item,key)=>{
      const {image=''} = item;
      return (
          <TouchableOpacity key={key} style={styles.banner} onPress={()=>this._onPressBanner(item)}>
              <Image style={styles.banner} source={{ uri: image }} />
          </TouchableOpacity>
      );
  }

  _renderItem = (item,key)=>{
      const {img_url='', title=''} = item;
      return (
          <TouchableOpacity key={key} style={styles.itemBack}  onPress={()=>this._onPressItem(item)}>
              <View style={styles.itemStyle}>
                  <Image style={styles.imageItem} source={{ uri: img_url }} />
                  <Text style={styles.titleItem}>{title}</Text>
              </View>
          </TouchableOpacity>
      );
  }

  render () {
      const {bannerList} = this.props;

      const items = [
          {'img_url': 'http://img18.3lian.com/d/file/201709/21/d8768c389b316e95ef29276c53a1e964.jpg','title':'1号'},
          {'img_url': 'http://img18.3lian.com/d/file/201709/21/f498e01633b5b704ebfe0385f52bad20.jpg','title':'2号'},
          {'img_url': 'http://pic1.16pic.com/00/10/09/16pic_1009413_b.jpg','title':'3号'},
          {'img_url': 'http://img3.redocn.com/tupian/20140910/xingganyouximeinvzhaopian_3014685.jpg','title':'4号'},
          {'img_url': 'http://img.juimg.com/tuku/yulantu/110322/8880-11032219110663.jpg','title':'5号'},
          {'img_url': 'http://pic7.nipic.com/20100515/3017209_104952727479_2.jpg','title':'6号'},
          {'img_url': 'http://img3.imgtn.bdimg.com/it/u=3142207919,2669735180&fm=200&gp=0.jpg','title':'7号'},
          {'img_url': 'http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg','title':'8号'},
          {'img_url': 'http://img18.3lian.com/d/file/201709/21/d8768c389b316e95ef29276c53a1e964.jpg','title':'9号'},
          {'img_url': 'http://img18.3lian.com/d/file/201709/21/f498e01633b5b704ebfe0385f52bad20.jpg','title':'10号'},
      ];

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
                  <SearchBar/>
              </View>
              <ScrollView style={styles.scrollView}
                  contentContainerStyle={styles.contentContainer}>
                  {!!items && items.map((item, i) => this._renderItem(item, i))}
              </ScrollView>
          </View>

      );
  }
}

const mapStateToProps = (state) =>{
    console.log('============state========================');
    console.log(state);
    console.log('============state========================');
    const {found:{bannerList}} = state;
    return { bannerList };
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    getBanner: () => dispatch(FoundActions.getBannerRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(FoundScreen);
