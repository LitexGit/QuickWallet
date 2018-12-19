import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from './Styles/MnemonicCompontStyle';

export default class MnemonicCompont extends Component {
    // // Prop type warnings
    // static propTypes = {
    //   someProperty: PropTypes.object,
    //   someSetting: PropTypes.bool.isRequired,
    // }
    //
    // // Defaults for props
    // static defaultProps = {
    //   someSetting: false
    // }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  render () {
      return (
          <View style={styles.container}>
              <Text>MnemonicCompont Component</Text>
          </View>
      );
  }
}
