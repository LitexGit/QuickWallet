import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Text} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/ImportScreenStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Metrics } from '../Themes';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import MnemonicCompont from '../Components/MnemonicCompont';
import KeyStoreCompont from '../Components/KeyStoreCompont';

class ImportScreen extends Component {
  static navigationOptions = {
      title:'导入账户',
  }
  _onChangeTab=()=>{

  }
  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  render () {
      return (
          <View style={styles.container}>
              <View style={styles.topSection}>
                  <MaterialCommunityIcons name={'calendar-import'} size={30} color={Colors.separateLineColor}/>
                  <Text style={styles.titleStytle}>导入账户</Text>
              </View>
              <View style={styles.bottomSection}>
                  <ScrollableTabView
                      initialPage={0}
                      style={styles.tabBarStyle}
                      tabBarActiveTextColor={Colors.textColor}
                      tabBarInactiveTextColor={Colors.separateLineColor}
                      tabBarUnderlineStyle={styles.tabBarUnderline}
                      renderTabBar={() => <DefaultTabBar/>}
                      onChangeTab={()=>this._onChangeTab()}>
                      <View tabLabel='助记词' style={styles.container}>
                          <MnemonicCompont/>
                      </View>
                      <View tabLabel='私钥' style={styles.container}>
                          <KeyStoreCompont/>
                      </View>
                  </ScrollableTabView>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportScreen);
