import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';

// Styles
import styles from './Styles/LanguageScreenStyle';

class LanguageScreen extends Component {

  static navigationOptions = {
      title:I18n.t('LanguageTabTitle'),
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  render () {
      return (
          <ScrollView style={styles.container}>
              <KeyboardAvoidingView behavior='position'>
                  <Text>LanguageScreen</Text>
              </KeyboardAvoidingView>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageScreen);
