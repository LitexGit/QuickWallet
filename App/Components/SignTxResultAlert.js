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
import {getValue} from '../Lib/Format';
import {toDecimal } from '../Lib/Helper'
const BN = require('bn.js');

class SignTxResultAlert extends Component {
  static propTypes = {
      isInit: PropTypes.bool,
      isWallet: PropTypes.bool,
      to:PropTypes.string,
      balance:PropTypes.string,
      gas:PropTypes.string,

      onPressCancel:PropTypes.func,
      onPressConfirm:PropTypes.func
  }

  static defaultProps = {
      isInit: false,
      isWallet: true,
      to:'0x',
      balance:'0',
      gas:'0'
  }

  // address: "0xb5538753F2641A83409D2786790b42aC857C5340"
  // balance: "1"
  // currency: {key: "CNY", title: "CNY", symbol: "￥", merge: ƒ, replace: ƒ, …}
  // dispatch: ƒ (action)
  // ethRate: "963.22"
  // gas: "75"
  // isInit: true
  // isWallet: true
  // onPressCancel: ƒ onPressCancel()
  // onPressConfirm: ƒ onPressConfirm()
  // selectedToken: {Id: 1, Symbol: "ETH", Tokenaddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", Decimal: 18, Description: "ethereum", …}
  // to: "0x38bCc5B8b793F544d86a94bd2AE94196567b865c"

  render () {
      const {isInit, address='', to='', onPressCancel, onPressConfirm, selectedToken, currency, ethRate} = this.props;
      const {symbol:cny} = currency
      const {Rate:rate='0.13', Symbol:symbol, Decimal: decimal} = selectedToken;

      let {balance='', gas: gasPrice = ''} = this.props;
      const gasLimit = 21000;

      gasPrice = new BN(gasPrice).mul(new BN(10).pow(new BN(9)));
      let gasPay = gasPrice.mul(new BN(gasLimit));
      gasPay = toDecimal({amount: gasPay.toString(), decimal, pos: 6})


      let totalBanance = undefined
      if (symbol === 'ETH') {
        totalBanance = parseFloat(balance) + parseFloat(gasPay) + ' ETH';
      } else {
        totalBanance = balance + ' ' +symbol + ' + ' + gasPay + ' ETH'
      }
      let totalValue = parseFloat(getValue(balance, rate)) + parseFloat(getValue(gasPay, ethRate));
      totalValue = totalValue.toFixed(2)

      const mark = {key:'symbol', units:balance, value:getValue(balance, rate)};
      const price = {key:'gasPrice', units:gasPay, value:getValue(gasPay, ethRate)};
      const txTotal = {key:'txTotal', units:totalBanance, value:totalValue};
      const items = [mark, price, txTotal];

      const signInfos = Object.values(SignInfoConfig).map((config, key)=>{
          for (const item of items) {
              const {key: itemKey} = item;
              if (itemKey === config.key) {
                  config.units = item.units;
                  config.value = item.value;
              }
          }
          const {title, units, value, key:index} = config;

          return (<View key={key}
              style={styles.infoItem}
                  >
              <Text style={styles.itemTitle}>{index === 'symbol' ? symbol : title}</Text>
              <View>
                  <Text style={styles.itemCount}>{units}</Text>
                  <Text style={styles.itemValue}>{cny}&nbsp;{value}</Text>
              </View>
          </View>);
      });

      return (
          <Overlay
              containerStyle={styles.overlay}
              childrenWrapperStyle={styles.content}
              visible={isInit}
              animationType="zoomIn"
              animationDuration={300}
          >
              <View style={styles.container}>
                  <View style={styles.topSection}>
                      <View style={styles.addressSection}>
                          <Text style={styles.titleStyle}>{I18n.t('ConfirmInfo')}</Text>
                          <AccountComponent address={address}/>
                          <View style={styles.direction}>
                              <View style={styles.separateLine}/>
                              <EvilIcons name={'arrow-down'}
                                  size={Metrics.bottomTabIconSize}
                                  color={Colors.textColor}
                              />
                              <View style={styles.separateLine}/>
                          </View>
                          <AccountComponent address={to}/>
                      </View>
                      <View style={styles.txSection}>
                          {signInfos}
                      </View>
                  </View>
                  <View style={styles.bottomSection}>
                      <TouchableOpacity style={styles.btnContainer}
                          onPress={onPressCancel}
                      >
                          <Text style={styles.btnTitle}>{I18n.t('CancelAction')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btnContainer, {backgroundColor: Colors.textColor}]}
                          onPress={onPressConfirm}
                      >
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
        user:{address, currency },
        assets:{selectedToken, ethRate}
    } = state;
    return { address, currency, selectedToken, ethRate };
};

export default connect(mapStateToProps)(SignTxResultAlert);




