import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/BackupScreenStyle';
import { Button } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { Colors } from '../Themes';
import { NavigationActions } from 'react-navigation';
import Ramda from 'ramda';
import Spinner from 'react-native-loading-spinner-overlay';
import WalletActions from '../Redux/WalletRedux';
import I18n from '../I18n';


class BackupScreen extends Component {
  static navigationOptions = {
      title:I18n.t('BackupTabTitle'),
  }

  constructor (props) {
      super(props);
      this.state = {
          words:[],
          pressArray:[],
          unPressArray:[],
          isSorted:true,
      };
  }

  _onPressCheck=()=>{
      const {mnemonic, passphrase} = this.props;
      this.props.gethImportMnemonic({mnemonic, passphrase});
  }

  _checkMnemonicSort=()=>{
      // TODO 比较数组顺序是否完全一致
      const {pressArray} = this.state;
      if (!pressArray.length) {
          this.setState({isSorted:true});
          return;
      }
      // TODO Redux 统一处理
      const {mnemonic} = this.props;
      const array = mnemonic.split(' ');
      pressArray.forEach((press, index)=>{
          const {title} = press;
          if (title !== Ramda.nth(index)(array)) {
              this.setState({isSorted:false});
              return;
          }
          this.setState({isSorted:true});
      });
  }

  _onPressSelected=(item)=>{
      const {key, title} = item;
      const {words, pressArray, unPressArray} = this.state;
      let removeArray = unPressArray;
      words.forEach((word)=>{
          const {key:wordKey, title:wordTitle} = word;
          if (wordKey !== key || wordTitle !== title) return;
          const isContains = Ramda.contains(word)(unPressArray);
          if (!isContains) {
              unPressArray.push(word);
          }
          const index =  Ramda.indexOf(word)(pressArray);
          removeArray = Ramda.remove(index,1)(pressArray);
      });
      const diff = (itemA, itemB)=> {
          const {sort:sortA} = itemA;
          const {sort:sortB} = itemB;
          return sortA - sortB;
      };
      Ramda.sort(diff)(unPressArray);
      const sortArray = Ramda.sort(diff)(unPressArray);
      this.setState({
          pressArray:removeArray,
          unPressArray:sortArray,
      },()=>{
          this._checkMnemonicSort();
      });
  }

  _onPressUnSelected=(item)=>{
      const {key, title} = item;
      const {words, pressArray, unPressArray} = this.state;
      let removeArray = unPressArray;
      words.forEach((word)=>{
          const {key:wordKey, title:wordTitle} = word;
          if (wordKey !== key || wordTitle !== title) return;
          const isContains = Ramda.contains(word)(pressArray);
          const index =  Ramda.indexOf(word)(unPressArray);
          if (!isContains) {
              pressArray.push(word);
          }
          removeArray = Ramda.remove(index,1)(unPressArray);
      });
      this.setState({
          pressArray,
          unPressArray:removeArray,
      },()=>{
          this._checkMnemonicSort();
      });
  }

  componentDidMount=()=>{
      this.props.setLoading({loading:false});

      const {mnemonic} = this.props;
      const array = mnemonic.split(' ');
      array.sort(() => .5 - Math.random());
      const words = array.map((title, key)=>{
          const wordObj = {title, key, sort:key};
          return wordObj;
      });
      this.setState({
          words,
          unPressArray:words
      });
  }

  render () {
      const remind = '请桉顺序点击助记词,以确认您的正确身份。';
      const toast = '助记词顺序不正确，请校对';
      const {loading} = this.props;
      const { pressArray, unPressArray, isSorted} = this.state;
      const isCanPress = isSorted && !unPressArray.length;

      const toastView = !isSorted ? (<View style={styles.toastView}>
          <Text style={styles.toastText}>{toast}</Text>
      </View>):null;

      const pressWord = pressArray.map((item, key)=>{
          const {title} = item;
          return (
              <TouchableOpacity key={key} onPress={()=>this._onPressSelected(item)}>
                  <View style={styles.wordsStyle}>
                      <Text>{title}</Text>
                  </View>
              </TouchableOpacity>);
      });

      const unPressWord = unPressArray.map((item, key)=>{
          const {title} = item;
          return (
              <TouchableOpacity key={key} onPress={()=>this._onPressUnSelected(item)}>
                  <View style={styles.wordsStyle}>
                      <Text>{title}</Text>
                  </View>
              </TouchableOpacity>);
      });

      return (
          <View style={styles.container}>
              <Spinner visible={loading} cancelable
                  textContent={'Loading...'}
                  textStyle={styles.spinnerText}/>
              <View style={styles.topSection}>
                  <View style={styles.topView}>
                      <Feather name={'check'} size={30} color={Colors.separateLineColor}/>
                      <Text style={styles.titleStytle}>{I18n.t('ConfirmMnemonic')}</Text>
                  </View>
                  <View style={styles.remindSection}>
                      <Text style={styles.remindText}>{remind}</Text>
                  </View>
                  {toastView}
                  <View style={styles.pressWordView}>
                      {pressWord}
                  </View>
                  <View style={styles.unPressWordView}>
                      {unPressWord}
                  </View>
              </View>
              <View style={styles.bottomSection}>
                  <View style={styles.btnStyle}>
                      <Button onPress={()=>this._onPressCheck()}
                          // disabled={!isCanPress}
                          backgroundColor={Colors.textColor}
                          title={ I18n.t('Complete')}/>
                  </View>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        wallet:{mnemonic, loading, passphrase}
    } = state;
    return { mnemonic, loading, passphrase};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    setLoading: ({loading}) => dispatch(WalletActions.setLoading({loading})),
    gethImportMnemonic: (params) => dispatch(WalletActions.gethImportMnemonic(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BackupScreen);
