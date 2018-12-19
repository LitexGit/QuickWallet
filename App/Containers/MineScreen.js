import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics , Colors, Fonts, } from '../Themes';
import styles from './Styles/MineScreenStyle';
import { View } from 'react-native-animatable';
import CreatConfig from '../Config/CreatConfig';
import { NavigationActions } from 'react-navigation';
import { Avatar } from 'react-native-elements';

class MineScreen extends Component {
  static navigationOptions = {
      tabBarIcon: ({tintColor}) => (
          <Ionicons name={'md-person'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  _onPressAvatar=()=>{
      console.log('===========_onPressAvatar=========================');
  }

  _onPressAssets=()=>{
      console.log('===========_onPressAssets=========================');
  }


  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  render () {
      const avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/kfriedson/128.jpg';
      const name = '1号';
      const assets = '资产总价值：￥100.00';




      const btns = Object.values(CreatConfig).map((config, index)=>{

      });

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
              <View style={styles.bottomSection}></View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
