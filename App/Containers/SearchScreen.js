import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/SearchScreenStyle';

class SearchScreen extends Component {
  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  render () {
      return (
          <ScrollView style={styles.container}>
              <KeyboardAvoidingView behavior='position'>
                  <Text>SearchScreen</Text>
              </KeyboardAvoidingView>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchScreen);
