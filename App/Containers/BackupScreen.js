import React, { Component } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/BackupScreenStyle';
import { Button } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Metrics } from '../Themes';
import { NavigationActions } from 'react-navigation';
import Ramda from 'ramda';


class BackupScreen extends Component {
  static navigationOptions = {
      title:'备份账户',
  }

  constructor (props) {
      super(props);
      this.state = {
          words:[],
          pressArray:[],
          unPressArray:[],
      };

  }

  _onPressCheck=()=>{

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
      });
  }

  componentDidMount=()=>{
      const mnemonic = 'text styles remind container icons container mnemonic container colors container container colors';
      const array = mnemonic.split(' ');
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
      const isCanPress = true;
      const { pressArray, unPressArray} = this.state;

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
              <View style={styles.topSection}>
                  <View style={styles.topView}>
                      <Feather name={'check'} size={30} color={Colors.separateLineColor}/>
                      <Text style={styles.titleStytle}>确认助记词</Text>
                  </View>
                  <View style={styles.remindSection}>
                      <Text style={styles.remindText}>{remind}</Text>
                  </View>
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
                          disabled={!isCanPress}
                          backgroundColor={Colors.textColor}
                          title='完成'/>
                  </View>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
});

export default connect(mapStateToProps, mapDispatchToProps)(BackupScreen);
