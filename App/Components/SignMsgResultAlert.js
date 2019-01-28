import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import styles from './Styles/SignMsgResultAlertStyle';
import Overlay from 'react-native-modal-overlay';
import AccountComponent from '../Components/AccountComponent';
import { Colors } from '../Themes';
import I18n from '../I18n';

export default class SignMsgResultAlert extends Component {
  static propTypes = {
      isInit: PropTypes.bool,
      onPressCancel:PropTypes.func,
      onPressConfirm:PropTypes.func,
  }

  static defaultProps = {
      isInit: false
  }

  componentDidMount=()=>console.log();

  render () {
      // const to = 'web3Provider  不支持 toAddress';
      const {isInit, message='' ,onPressCancel, onPressConfirm} = this.props;
      return (
          <Overlay
              containerStyle={styles.overlay}
              childrenWrapperStyle={styles.content}
              visible={isInit}
              animationType='zoomIn'
              animationDuration={300}>
              <View style={styles.container}>
                  <View style={styles.topSection}>
                      <View style={styles.addressSection}>
                          <Text style={styles.titleStyle}>{I18n.t('ConfirmInfo')}</Text>
                          {/* <AccountComponent address={to}/> */}
                      </View>
                      <Text style={styles.signMsg}>{I18n.t('SignMessage')}</Text>
                  </View>
                  <View style={styles.msgSection}>
                      <Text style={styles.message} numberOfLines={5} ellipsizeMode='tail'>{message}</Text>
                  </View>
                  <View style={styles.bottomSection}>
                      <TouchableOpacity style={styles.btnContainer} onPress={onPressCancel}>
                          <Text style={styles.btnTitle}>{I18n.t('CancelAction')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btnContainer, {backgroundColor: Colors.textColor}]} onPress={onPressConfirm}>
                          <Text style={styles.btnTitle}>{I18n.t('ConfirmAction')}</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Overlay>
      );
  }
}
