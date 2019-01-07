import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/SignTxResultAlertStyle';
import Overlay from 'react-native-modal-overlay';
import SignInfoConfig from '../Config/SignInfoConfig';
import AccountComponent from '../Components/AccountComponent';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Metrics, Colors } from '../Themes';
import { connect } from 'react-redux';
import I18n from '../I18n';
import {getToken, getWei} from '../Lib/Format';


class SignTxResultAlert extends Component {
  static propTypes = {
      isInit: PropTypes.bool,
      to:PropTypes.string,
      balance:PropTypes.string,
      gas:PropTypes.string,

      onPressCancel:PropTypes.func,
      onPressConfirm:PropTypes.func,
  }

  static defaultProps = {
      isInit: false,
      to:'0x',
      balance:'0',
      gas:'0',
  }

  componentDidMount=()=>{
      console.log();
  }

  render () {
      const {isInit, address, to, balance, gas, onPressCancel, onPressConfirm} = this.props;

      const gasLimit = 21000;
      const price = getWei(gas, 9) * gasLimit / 1e18;

      const symbol = {key:'symbol', units:balance, value:'￥654'};
      const gasPrice = {key:'gasPrice', units:price, value:'￥6.1'};
      const txTotal = {key:'txTotal', units:parseFloat(balance) + price, value:'￥660.5'};

      const items = [symbol, gasPrice, txTotal];

      const signInfos = Object.values(SignInfoConfig).map((config, key)=>{
          for (const item of items) {
              const {key: itemKey} = item;
              if (itemKey === config.key) {
                  config.units = item.units;
                  config.value = item.value;
              }
          }

          const {title, units, value} = config;
          return (<View key={key} style={styles.infoItem}>
              <Text style={styles.itemTitle}>{title}</Text>
              <View>
                  <Text style={styles.itemCount}>{units}</Text>
                  <Text style={styles.itemValue}>{value}</Text>
              </View>
          </View>);
      });

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
                          <AccountComponent address={address}/>
                          <View style={styles.direction}>
                              <View style={styles.separateLine}/>
                              <EvilIcons name={'arrow-down'} size={Metrics.bottomTabIconSize} color={Colors.textColor}/>
                              <View style={styles.separateLine}/>
                          </View>
                          <AccountComponent address={to}/>
                      </View>
                      <View style={styles.txSection}>
                          {signInfos}
                      </View>
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

const mapStateToProps = (state) => {
    const {
        user:{address}
    } = state;
    return { address};
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SignTxResultAlert);




