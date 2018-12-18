import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SettingScreenStyle';

class SettingScreen extends Component {
  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  render () {
      return (
          <ScrollView style={styles.container}>
              <KeyboardAvoidingView behavior='position'>
                  <Text>SettingScreen</Text>
              </KeyboardAvoidingView>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
