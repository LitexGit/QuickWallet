import React, { Component } from 'react';
import {View, ScrollView, Text, KeyboardAvoidingView, TextInput, TouchableOpacity, Slider } from 'react-native';
import { connect } from 'react-redux';
import CommomBtnComponent from '../Components/CommomBtnComponent';
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
import Toast from 'react-native-root-toast';
import {isValidAddress} from '../Lib/Utils';
import {getDisplayFiat} from '../Lib/Format';

class TransferScreen extends Component {

    static navigationOptions = {
        title:I18n.t('AssetsTabTitle'),
    }

    constructor(props){
        super(props);
        this.state = {
            inputGas:10,
            minGas: 1,
            maxGas: 100,

            inputBalance:'0',
            inputAddress:'',
            inputFiat:'',

            isShowSignTx:false,
            isShowPswdInput:false,
        };
    }

  _onPressBtn=()=>{
      const {selectedToken} = this.props;
      const {count} = selectedToken;
      const {inputBalance, inputAddress} = this.state;
      if (parseFloat(inputBalance) >= parseFloat(count)) {
          Toast.show(I18n.t('LackBalanceError'), {
              shadow:true,
              position: Toast.positions.CENTER,
          });
          return;
      }
      if (!isValidAddress(inputAddress)) {
          Toast.show(I18n.t('InvalidAddressError'), {
              shadow:true,
              position: Toast.positions.CENTER,
          });
          return;
      }
      this.setState({
          isShowSignTx:true,
      });
  }

  _onChangeBalance=(text)=>{
      const {selectedToken } = this.props;
      const {Rate:rate} = selectedToken;
      const inputFiat = rate * text;
      this.setState({
          inputBalance:text,
          inputFiat
      });
  }

  _onChangeAddress=(text)=>{
      this.setState({
          inputAddress:text,
      });
  }

  _onPressScan=()=>{
      this.props.navigate('ScanScreen',{
          callback:(params)=>{
              const {data=''} = params;
              this.setState({
                  inputAddress:data
              });
          }
      });
  }

  _onSlidingComplete=(gas)=>{
      this.setState({ inputGas: gas });
  }
  _onSliderChange=()=>{
      ReactNativeHapticFeedback.trigger();
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
      this.props.gethUnlockAccount({passphrase});
  }


  _transfer=()=>{
      const {passphrase='', address='', selectedToken} = this.props;
      const {Tokenaddress:tokenAddress, Symbol:symbol, Decimal:decimal} = selectedToken;
      const {inputBalance, inputAddress, inputGas} = this.state;

      this.props.gethTransfer({
          symbol,
          passphrase,
          fromAddress:address,
          toAddress:inputAddress,
          value:inputBalance,
          gasPrice:inputGas.toString(),
          decimal,
          tokenAddress}
      );
  }

  componentDidMount=()=>{
      this.isUnlockListener = EventEmitter.addListener(EventKeys.IS_UNLOCK_ACCOUNT, ({isUnlock})=>{
          if (isUnlock) {
              this._transfer();
              return;
          }
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
      const isCanTransfer = true;

      const {inputGas=10,  minGas=1, maxGas=100, isShowSignTx, inputAddress,inputBalance, isShowPswdInput, inputFiat} = this.state;
      const { loading, selectedToken, currency } = this.props;
      const {Symbol:symbol, count} = selectedToken;
      const {symbol:mark} = currency;


      return (
          <View style={styles.container}>
              <Spinner visible={loading} cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}/>
              <SignTxResultAlert
                  isInit={isShowSignTx}
                  to={inputAddress}
                  balance={inputBalance}
                  gas={inputGas.toString()}
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
                              <Text style={styles.balanceText}>{ I18n.t('Balance')}: {count} {symbol}</Text>
                          </View>
                          <View style={styles.bananceTopView}>
                              <TextInput autoFocus style={styles.balanceInput}
                                  clearButtonMode='while-editing'
                                  multiline={false}
                                  placeholder={I18n.t('EnterAmount')}
                                  placeholderTextColor={Colors.separateLineColor}
                                  underlineColorAndroid={'transparent'}
                                  onChangeText={this._onChangeBalance}
                                  returnKeyType='next'/>
                              <Text style={[styles.balanceText, {maxWidth:'35%'}]} numberOfLines={1}>{mark}: {getDisplayFiat(inputFiat)}</Text>
                          </View>
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
                              placeholder={ I18n.t('EnterEthAddress') }
                              placeholderTextColor={Colors.separateLineColor}
                              underlineColorAndroid={'transparent'}
                              onChangeText={this._onChangeAddress}
                              returnKeyType='done'/>
                      </View>
                  </KeyboardAvoidingView>
                  <View style={styles.gaseSection}>
                      <View style={styles.sliderView}>
                          <Text style={[styles.titleText, {fontWeight:'500'}]}>Gas</Text>
                          <Slider style={styles.slider}
                              step={1}
                              value={inputGas}
                              minimumValue={minGas}
                              maximumValue={maxGas}
                              onSlidingComplete={(gas) => this._onSlidingComplete(gas)}
                              onValueChange={(gas) => this._onSliderChange(gas)}/>
                      </View>
                      <Text style={styles.gasText}>{inputGas} gwei</Text>
                  </View>
              </ScrollView>
              <View style={styles.bottomSection}>
                  <CommomBtnComponent
                      disabled={!isCanTransfer}
                      title={I18n.t('NextStep')}
                      onPress={()=>this._onPressBtn()}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        user:{address, passphrase, currency},
        assets:{selectedToken},
        wallet:{loading}
    } = state;
    return { selectedToken, passphrase, address, loading, currency};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route, params) => dispatch(NavigationActions.navigate({routeName: route, params})),
    gethIsUnlockAccount: () => dispatch(WalletActions.gethIsUnlockAccount()),
    gethUnlockAccount: (params) => dispatch(WalletActions.gethUnlockAccount(params)),
    gethTransfer: (params) => dispatch(WalletActions.gethTransfer(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferScreen);
