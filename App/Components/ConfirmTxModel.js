import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/ConfirmTxModelStyle';
import Overlay from 'react-native-modal-overlay';
import SignInfoConfig from '../Config/SignInfoConfig';
import AccountComponent from '../Components/AccountComponent';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Metrics, Colors } from '../Themes';
import { connect } from 'react-redux';
import I18n from '../I18n';
import { getValue } from '../Lib/Format';
import { toDecimal } from '../Lib/Helper'
const BN = require('bn.js');

class ConfirmTxModel extends Component {
  static propTypes = {
    isInit: PropTypes.bool,
    isWallet: PropTypes.bool,
    signInfo: PropTypes.object,
    onPressCancel: PropTypes.func,
    onPressConfirm: PropTypes.func
  }

  static defaultProps = {
    isInit: false,
    isWallet: true,
    signInfo: {}
  }

  // id: 8888
  // name: "signTransaction"
  // object:
  //     chainType: "ETH"
  //     data: "0x56c49c88000000000000000000000000793f178be9966cbf18937f05849685161a5ecaa5"
  //     from: "0xb5538753f2641a83409d2786790b42ac857c5340"
  //     gas: "21000"
  //     gasLimit: 300000
  //     gasPrice: "1100000000"
  //     to: "0x095a2E786206Bb8Fc5a50a53F11B4F79CF356A18"
  //     value: "0"

  render() {
    const { isInit, onPressCancel, onPressConfirm, currency, ethRate, signInfo } = this.props;
    const { chainType, data, from, gas, gasPrice, to, value } = signInfo;
    const { symbol: cny } = currency;

    const balance = toDecimal({ amount: value })

    let gasPay = (new BN(gas)).mul(new BN(gasPrice));
    gasPay = toDecimal({ amount: gasPay.toString(), pos: 6 })

    const totalBanance = parseFloat(balance) + parseFloat(gasPay) + ' ETH';

    let totalValue = parseFloat(getValue(balance, ethRate)) + parseFloat(getValue(gasPay, ethRate));
    totalValue = totalValue.toFixed(2)

    const mark = { key: 'symbol', units: balance, value: getValue(balance, ethRate) };
    const price = { key: 'gasPrice', units: gasPay, value: getValue(gasPay, ethRate) };
    const txTotal = { key: 'txTotal', units: totalBanance, value: totalValue };
    const items = [mark, price, txTotal];

    const signInfos = Object.values(SignInfoConfig).map((config, key) => {
      for (const item of items) {
        const { key: itemKey } = item;
        if (itemKey === config.key) {
          config.units = item.units;
          config.value = item.value;
        }
      }
      const { title, units, value, key: index } = config;

      return (<View key={key}
          style={styles.infoItem}
              >
        <Text style={styles.itemTitle}>{index === 'symbol' ? chainType : title}</Text>
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
              <AccountComponent address={from} />
              <View style={styles.direction}>
                <View style={styles.separateLine} />
                <EvilIcons name={'arrow-down'}
                    size={Metrics.bottomTabIconSize}
                    color={Colors.textColor}
                />
                <View style={styles.separateLine} />
              </View>
              <AccountComponent address={to} />
            </View>
            {/* <View style={styles.txSection}>
              <Text style={styles.dataContent}>{data}</Text>
            </View> */}
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
            <TouchableOpacity style={[styles.btnContainer, { backgroundColor: Colors.textColor }]}
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
    user: { address, currency },
    assets: { ethRate }
  } = state;
  return { address, currency, ethRate };
};

export default connect(mapStateToProps)(ConfirmTxModel);
