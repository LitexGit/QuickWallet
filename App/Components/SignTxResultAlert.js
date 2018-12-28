import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/SignTxResultAlertStyle';
import Overlay from 'react-native-modal-overlay';
import { connect } from 'react-redux';
import WalletActions from '../Redux/WalletRedux';
import SignInfoConfig from '../Config/SignInfoConfig';
import AccountComponent from '../Components/AccountComponent';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Metrics, Colors } from '../Themes';


export default class SignTxResultAlert extends Component {
  static propTypes = {
      isInit: PropTypes.bool,
  }

  static defaultProps = {
      isInit: false
  }
  constructor(props){
      super(props);
      this.state={
          isShow:true,
      };
      this.password='';
  }

  _onPressCancel=()=>{
      this.setState({
          isShow:false,
      });
  }

_onPressConfirm=()=>{
    this.setState({
        isShow:false,
    });
    // TODO sign
    // const {gethSign} = this.props;
}

render () {
    const title = '确认信息';
    const from = '0xb5538753F2641A83409D2786790b42aC857C5340';
    const to = '0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db';

    const {isInit} = this.props;

    const {isShow} = this.state;
    const isOpen = isInit && isShow;

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
            visible={isOpen}
            animationType='zoomIn'
            animationDuration={300}>
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <View style={styles.addressSection}>
                        <Text style={styles.titleStyle}>{title}</Text>
                        <AccountComponent address={from}/>
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
                    <TouchableOpacity style={styles.btnContainer} onPress={()=>this._onPressCancel()}>
                        <Text style={styles.btnTitle}>取消</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnContainer, {backgroundColor: Colors.textColor}]} onPress={()=>this._onPressConfirm()}>
                        <Text style={styles.btnTitle}>确认</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Overlay>
    );
}
}





