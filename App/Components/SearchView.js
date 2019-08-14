import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './Styles/SearchViewStyle'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class SearchView extends Component {
  static propTypes = {
    onPressScan: PropTypes.func,
    onPressSearch: PropTypes.func
  }

  render () {
    return (
      <View style={styles.container}>
          <TouchableOpacity style={{flex: 1}}
              onPress={this.props.onPressSearch}
          >
            <View style={styles.leftSection}>
              <Text style={styles.placeholder}>搜索/输入Dapp网址</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={this.props.onPressScan}>
              <Ionicons style={styles.scanner}
                  name={'ios-qr-scanner'}
                  size={24}
                  color={'#A4A4A4'}
              />
          </TouchableOpacity>
      </View>
    )
  }
}
