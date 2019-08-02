import React, { Component } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics } from '../Themes';
import styles from './Styles/MineScreenStyle';
import I18n from '../I18n';

import PreMineComponent from '../Components/PreMineComponent';
import MineComponent from '../Components/MineComponent';


class MineScreen extends Component {
  static navigationOptions = () => {
      return {
        tabBarLabel: I18n.t('MineTabBarLabel'),
        tabBarIcon: ({tintColor}) => (
            <Ionicons name={'md-person'}
                size={Metrics.bottomTabIconSize}
                color={tintColor}
            />
        )
      }
  }

  componentDidMount=()=>{
      this.willFocusSubscription = this.props.navigation.addListener('willFocus', () =>{
          // console.log('===========willFocus=========================');
      });
      this.didFocusSubscription = this.props.navigation.addListener('didFocus', () =>{
          // console.log('===========didFocus=========================');
      });
  };

  componentWillUnmount=()=>{
      this.willFocusSubscription.remove();
      this.didFocusSubscription.remove();
  }

  render () {
      const {isLoginInfo} = this.props;
      return (
          <View style={styles.container}>
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
