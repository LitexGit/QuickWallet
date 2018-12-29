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


class SignTxResultAlert extends Component {
  static propTypes = {
      isInit: PropTypes.bool,
      to:PropTypes.string,
      balance:PropTypes.number,
      gas:PropTypes.number,

      onPressCancel:PropTypes.func,
      onPressConfirm:PropTypes.func,
  }

  static defaultProps = {
      isInit: false,
      to:'',
      balance:0,
      gas:0,
  }

  componentDidMount=()=>{
      console.log();
  }

  render () {
      const title = '确认信息';
      const {isInit, address, to, balance, gas, onPressCancel, onPressConfirm} = this.props;

      // TODO 构建数据源
      const signInfos = Object.values(SignInfoConfig).map((config, key)=>{
          const {title, count, fiatValue} = config;
          return (<View key={key} style={styles.infoItem}>
              <Text style={styles.itemTitle}>{title}</Text>
              <View>
                  <Text style={styles.itemCount}>{count}</Text>
                  <Text style={styles.itemValue}>{fiatValue}</Text>
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
                          <Text style={styles.titleStyle}>{title}</Text>
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

const mapStateToProps = (state) => {
    const {
        wallet:{ address }
    } = state;
    return { address};
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SignTxResultAlert);




