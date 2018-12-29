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
import SignTxResultAlert from '../Components/SignTxResultAlert';
import PassphraseInputAlert from '../Components/PassphraseInputAlert';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import Spinner from 'react-native-loading-spinner-overlay';

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

            isShowSignTx:false,
            isShowPswdInput:false,
        };
        this.inputGas = 10;
    }

  _onPressBtn=()=>{
      this.setState({
          isShowSignTx:true,
      });
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
      // console.log('==============_checkInputIsValid======================');
  }

  componentDidMount=()=>{
      this._checkInputIsValid();
  }

  // 交易信息确认
  _signCancel=()=>{
      this.setState({
          isShowSignTx:false,
      });
  }
  _signConfirm=()=>{
      this.setState({
          isShowSignTx:false,
      });
      // console.log('=============gethIsUnlockAccount=======================');
      this.props.gethIsUnlockAccount();
  }

  // 解锁钱包
  _pswdInputCancel=()=>{
      this.setState({
          isShowPswdInput:false,
      });
  }
  _pswdInputConfirm=(passphrase)=>{
      this.setState({
          isShowPswdInput:false,
      });
      // console.log('=============gethUnlockAccount=======================');
      this.props.gethUnlockAccount({passphrase});
  }


  _transfer=()=>{
      // console.log('=============transfer=======================');
      const {passphrase='', address=''} = this.props;
      const tokenAddress = '0x875664e580eea9d5313f056d0c2a43af431c660f';
      const symbol = 'ETH';
      const decimal = 1e18;
      const {inputBalance, inputAddress} = this.state;

      this.props.gethTransfer({
          symbol,
          passphrase,
          fromAddress:address,
          toAddress:inputAddress,
          value:inputBalance,
          gasPrice:this.inputGas,
          decimal,
          tokenAddress}
      );
  }

  componentDidMount=()=>{
      this.isUnlockListener = EventEmitter.addListener(EventKeys.IS_UNLOCK_ACCOUNT, ({isUnlock})=>{
          if (isUnlock) {
              // console.log('=============unlock=======================');
              this._transfer();
              return;
          }
          // console.log('=============lock=======================');
          this.setState({
              isShowPswdInput:true,
          });
      });
      this.lockListener = EventEmitter.addListener(EventKeys.WALLET_UNLOCKED, this._transfer);
  }

  componentWillUnmount=()=>{
      this.lockListener.remove();
      this.isUnlockListener.remove();
  }

  render () {
      const btnTitle = '下一步';
      const isCanTransfer = true;
      const symbol = 'ETH';
      const assets = 0;

      const {displayGas=10,  minGas=1, maxGas=100, isShowSignTx, inputAddress,inputBalance, isShowPswdInput} = this.state;
      const { loading } = this.props;

      return (
          <View style={styles.container}>
              <Spinner visible={loading} cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}/>
              <SignTxResultAlert
                  isInit={isShowSignTx}
                  to={inputAddress}
                  balance={inputBalance}
                  gas={this.inputGas}
                  onPressCancel={()=>this._signCancel()}
                  onPressConfirm={()=>this._signConfirm()}/>
              <PassphraseInputAlert
                  isInit={isShowPswdInput}
                  onPressCancel={()=>this._pswdInputCancel()}
                  onPressConfirm={(passphrase)=>this._pswdInputConfirm(passphrase)}/>
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
                      <Text style={styles.gasText}>{displayGas} gwei</Text>
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
    // console.log('===============TransferScreen=====================');
    // console.log(state);
    // console.log('===============TransferScreen=====================');
    const {
        wallet:{ passphrase, address, loading}
    } = state;
    return { passphrase, address, loading};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    gethIsUnlockAccount: () => dispatch(WalletActions.gethIsUnlockAccount()),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
    gethTransfer: (params) => dispatch(WalletActions.gethTransfer(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen);
