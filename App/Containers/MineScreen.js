import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics } from '../Themes';
import styles from './Styles/MineScreenStyle';
import I18n from '../I18n';

import PreMineComponent from '../Components/PreMineComponent';
import MineComponent from '../Components/MineComponent';

import { NavigationEvents } from 'react-navigation';

class MineScreen extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      tabBarLabel: navigation.getParam('tabBarLabel') || I18n.t('MineTabBarLabel'),
      tabBarIcon: ({tintColor}) => (
          <Ionicons name={'md-person'}
              size={Metrics.bottomTabIconSize}
              color={tintColor}
          />
      )
    }
  }

  componentDidMount=()=>{
    this._updateTitle();
  };

  _updateTitle= async ()=>{
    this.props.navigation.setParams({
      tabBarLabel: I18n.t('MineTabBarLabel')
    });
  }

  render () {
      const {isLoginInfo} = this.props;
      return (
          <View style={styles.container}>
              <NavigationEvents onDidFocus={()=> this._updateTitle()}/>
              {isLoginInfo ? <MineComponent/> : <PreMineComponent/>}
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        user:{isLoginInfo}
    } = state;
    return {
        isLoginInfo
    };
};

const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
