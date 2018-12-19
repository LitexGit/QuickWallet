import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics , Colors, Fonts, } from '../Themes';
import styles from './Styles/MineScreenStyle';
import { View } from 'react-native-animatable';
import CreatConfig from '../Config/CreatConfig';
import { NavigationActions } from 'react-navigation';

class MineScreen extends Component {
  static navigationOptions = {
      tabBarIcon: ({tintColor}) => (
          <Ionicons name={'md-person'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  render () {
      const btns = Object.values(CreatConfig).map((config, index)=>{

      });

      return (
          <View style={styles.container}>


          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
