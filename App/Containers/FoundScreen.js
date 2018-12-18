import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, View, TouchableWithoutFeedback, Image} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { Metrics } from '../Themes';
import Swiper from 'react-native-swiper';

// Styles
import styles from './Styles/FoundScreenStyle';
class FoundScreen extends Component {
  static navigationOptions = {
      tabBarIcon: ({tintColor}) => (
          <Material name={'cube-outline'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  constructor(props) {
      super(props);
      this.state = {
      };
  }

  _onPressBanner = (item)=>{
      console.log('============_onPressBanner========================');
      console.log(item);
      console.log('============_onPressBanner========================');
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  _renderBanner = (item,key)=>{
      const {img_url=''} = item;
      return (
          <TouchableWithoutFeedback key={key} onPress={(item)=>this._onPressBanner(item)}>
              <Image style={styles.banner} source={{ uri: img_url }} />
          </TouchableWithoutFeedback>
      );
  }

  render () {
      const banners = [
          {'img_url': 'http://img18.3lian.com/d/file/201709/21/d8768c389b316e95ef29276c53a1e964.jpg'},
          {'img_url': 'http://img18.3lian.com/d/file/201709/21/f498e01633b5b704ebfe0385f52bad20.jpg'},
          {'img_url': 'http://pic1.16pic.com/00/10/09/16pic_1009413_b.jpg'}
      ];

      const  swiper = (
          <Swiper key={banners.length} autoplay loop showsPagination>
              { !!banners && banners.map((item, i) => this._renderBanner(item, i)) }
          </Swiper>
      );

      return (
          <View style={styles.container}>
              <View style={styles.topSection}>
                  {swiper}
              </View>
              <View>

              </View>
              <ScrollView >
                  <KeyboardAvoidingView behavior='position'>
                      <Text>FoundScreen</Text>
                  </KeyboardAvoidingView>
              </ScrollView>
          </View>

      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(FoundScreen);
