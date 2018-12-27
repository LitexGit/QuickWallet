import React, { Component } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics } from '../Themes';
import styles from './Styles/MineScreenStyle';
import I18n from '../I18n';

import PreMineComponent from '../Components/PreMineComponent';
import MineComponent from '../Components/MineComponent';


export default class MineScreen extends Component {
  static navigationOptions = {
      tabBarLabel: I18n.t('MineTabBarLabel'),
      tabBarIcon: ({tintColor}) => (
          <Ionicons name={'md-person'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  componentDidMount=()=>{
      console.log('===========MineScreen=========================');
  }

  render () {

      return (
          <View style={styles.container}>
              <PreMineComponent/>
              {/* <MineComponent/> */}
          </View>
      );
  }
}
