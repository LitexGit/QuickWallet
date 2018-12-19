import React, { Component } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/PreBackupScreenStyle';
import { Button } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors, Metrics } from '../Themes';


class PreBackupScreen extends Component {
  static navigationOptions = {
      title:'备份账户',
  }
  _onPressBtn=()=>{

  }
  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  render () {
      const remind = '请仔细抄写下方助记词，我们将在下一步验证';
      const mnemonic = 'text styles remind container icons container mnemonic container colors container container';
      return (
          <View style={styles.container}>
              <View style={styles.topSection}>
                  <View style={styles.topView}>
                      <FontAwesome name={'pencil-square-o'} size={30} color={Colors.separateLineColor}/>
                      <Text style={styles.titleStytle}>备份助记词</Text>
                  </View>
                  <View style={styles.remindSection}>
                      <Text style={styles.remindText}>{remind}</Text>
                  </View>
                  <Text style={styles.mnemonicText}>{mnemonic}</Text>
              </View>
              <View style={styles.bottomSection}>
                  <View style={styles.btnStyle}>
                      <Button onPress={()=>this._onPressBtn()}
                          backgroundColor={Colors.textColor}
                          title='下一步'/>
                  </View>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(PreBackupScreen);
