import React, { Component } from 'react';
import {View, ScrollView, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Slider } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import styles from './Styles/TransferScreenStyle';
import { Colors } from '../Themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { NavigationActions } from 'react-navigation';
import WalletActions from '../Redux/WalletRedux';
import I18n from '../I18n';

class TransferScreen extends Component {

    static navigationOptions = {
        title:I18n.t('AssetsTabTitle'),
    }

    constructor(props){
        super(props);
        this.state = {
            displayGas:10,
            minGas: 1,
            maxGas: 100,

            inputBalance:'0',
            inputAddress:'0x38bCc5B8b793F544d86a94bd2AE94196567b865c',
        };
        this.inputGas = 10;
    }

  _onPressBtn=()=>{
      let {passphrase='', address=''} = this.props;
      // util 统一对 passphrase 做校验
      passphrase = '11111111';
      // util 统一对 address 做校验
      address = '0xb5538753F2641A83409D2786790b42aC857C5340';

      const symbol = 'ETH';
      const decimal = 1e9;
      const {inputBalance, inputAddress} = this.state;
      this.props.gethTransfer({symbol, passphrase, fromAddress:address, toAddress:inputAddress, value:inputBalance, gasPrice:this.inputGas, decimal});
  }

  _onChangeBalance=(text)=>{
      // TODO 005 输入金额大于当前余额 toast
      this.setState({
          inputBalance:text,
      },()=>this._checkInputIsValid());
  }

  _onChangeAddress=(text)=>{
      this.setState({
          inputAddress:text,
      },()=>this._checkInputIsValid());
  }

  _onPressScan=()=>{
      this.props.navigate('ScanScreen',{
          callback:(params)=>{
              const {data=''} = params;
              this.setState({
                  inputAddress:data
              },()=>{
              // TODO 004: 添加对地址合法性校验
              });
          }
      });
  }


  _onSlidingComplete=(gas)=>{
      this.inputGas = gas;
      this._checkInputIsValid();
  }
  _onSliderChange=(gas)=>{
      this.setState({
          displayGas: gas
      });
      ReactNativeHapticFeedback.trigger();
  }

  _checkInputIsValid=()=>{
      console.log('==============_checkInputIsValid======================');
  }

  componentDidMount=()=>{
      this._checkInputIsValid();
  }

  render () {
      const btnTitle = '下一步';
      const isCanTransfer = true;
      const symbol = 'ETH';
      const assets = 0;

      const {displayGas=10,  minGas=1, maxGas=100, inputAddress=''} = this.state;
      return (
          <View style={styles.container}>
              <ScrollView style={styles.scrollView}>
                  <KeyboardAvoidingView behavior='position'>
                      <View style={styles.bananceSection}>
                          <View style={styles.bananceTopView}>
                              <Text style={styles.titleText}>{symbol}</Text>
                              <Text style={styles.balanceText}>{ I18n.t('Balance')}:{assets}{symbol}</Text>
                          </View>
                          <TextInput autoFocus style={styles.balanceInput}
                              clearButtonMode='while-editing'
                              multiline={false}
                              placeholder={I18n.t('EnterAmount')}
                              placeholderTextColor={Colors.separateLineColor}
                              underlineColorAndroid={'transparent'}
                              keyboardType='number-pad'
                              onChangeText={this._onChangeBalance}/>
                      </View>
                      <View style={styles.addressSection}>
                          <View style={styles.bananceTopView}>
                              <Text style={styles.titleText}>{ I18n.t('ToAddress')}</Text>
                              <TouchableOpacity onPress={()=>this._onPressScan()}>
                                  <Ionicons name={'ios-qr-scanner'} size={24} color={'#A4A4A4'}/>
                              </TouchableOpacity>
                          </View>
                          <TextInput style={styles.addressInput}
                              value={inputAddress}
                              clearButtonMode='while-editing'
                              placeholder={ I18n.t('EnterEthAddress')}
                              placeholderTextColor={Colors.separateLineColor}
                              underlineColorAndroid={'transparent'}
                              onChangeText={this._onChangeAddress}/>
                      </View>
                  </KeyboardAvoidingView>
                  <View style={styles.gaseSection}>
                      <View style={styles.sliderView}>
                          <Text style={[styles.titleText, {fontWeight:'500'}]}>Gas</Text>
                          <Slider style={styles.slider}
                              step={1}
                              value={displayGas}
                              minimumValue={minGas}
                              maximumValue={maxGas}
                              onSlidingComplete={(gas) => this._onSlidingComplete(gas)}
                              onValueChange={(gas) => this._onSliderChange(gas)}/>
                      </View>
                      <Text style={styles.gasText}>{displayGas}gwei</Text>
                  </View>
              </ScrollView>
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBtn()}
                      backgroundColor={Colors.textColor}
                      disabled={!isCanTransfer}
                      title={btnTitle}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{ passphrase, address}
    } = state;
    return { passphrase, address};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    gethTransfer: (params) => dispatch(WalletActions.gethTransfer(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen);
