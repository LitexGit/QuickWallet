import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { Metrics } from '../Themes';

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

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');

      console.log('====================================');
      console.log(I18n.t('FoundTabBarLabel'));
      console.log('====================================');
  }
  render () {
      return (
          <ScrollView style={styles.container}>
              <KeyboardAvoidingView behavior='position'>
                  <Text>FoundScreen</Text>
              </KeyboardAvoidingView>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(FoundScreen);
