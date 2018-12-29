import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/SignMsgResultAlertStyle';
import Overlay from 'react-native-modal-overlay';
import { connect } from 'react-redux';
import WalletActions from '../Redux/WalletRedux';
import AccountComponent from '../Components/AccountComponent';
import { Metrics, Colors } from '../Themes';

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
      const title = '确认信息';
      const from = '0xb5538753F2641A83409D2786790b42aC857C5340';

      const {isInit, onPressCancel, onPressConfirm} = this.props;
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
                          <Text style={styles.titleStyle}>{title}</Text>
                          <AccountComponent address={from}/>
                      </View>
                  </View>
                  <View style={styles.msgSection}></View>
                  <View style={styles.bottomSection}>
                      <TouchableOpacity style={styles.btnContainer} onPress={onPressCancel}>
                          <Text style={styles.btnTitle}>取消</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btnContainer, {backgroundColor: Colors.textColor}]} onPress={onPressConfirm}>
                          <Text style={styles.btnTitle}>确认</Text>
                      </TouchableOpacity>
                  </View>
              </View>
          </Overlay>
      );
  }
}
