import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/ListFooterComponentStyle';
import I18n from '../I18n';

export default class ListFooterComponent extends Component {

  static propTypes = {
      loading: PropTypes.bool.isRequired,
      text: PropTypes.string,
      onPress: PropTypes.func.isRequired
  }

  static defaultProps = {
      loading: false,
      text: '加载更多',
  }

  componentDidMount=()=>{
      console.log();
  }

  render () {
      const {loading, text, onPress} = this.props;
      const loadingText =  I18n.t('Loading');
      return (
          <View style={styles.container}>
              <TouchableOpacity style={styles.footerButton} onPress={onPress}>
                  <Text style={styles.footerText}>{ loading ? loadingText : text }</Text>
              </TouchableOpacity>
          </View>
      );
  }
}
