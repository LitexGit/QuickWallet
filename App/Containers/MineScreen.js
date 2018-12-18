import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics } from '../Themes';

// Styles
import styles from './Styles/MineScreenStyle';

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
      return (
          <ScrollView style={styles.container}>
              <KeyboardAvoidingView behavior='position'>
                  <Text>MineScreen</Text>
              </KeyboardAvoidingView>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(MineScreen);
