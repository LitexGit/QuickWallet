import React, { Component } from 'react';
import { View, Text} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/ImportScreenStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Themes';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import MnemonicCompont from '../Components/MnemonicCompont';
import KeyStoreCompont from '../Components/KeyStoreCompont';
import I18n from '../I18n';


class ImportScreen extends Component {
  static navigationOptions = {
      title:I18n.t('ImportTabTitle'),
  }

  _onChangeTab=()=>console.log();

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
                      <View tabLabel={I18n.t('Mnemonic')} style={styles.container}>
                          <MnemonicCompont/>
                      </View>
                      <View tabLabel={I18n.t('PrivateKey')} style={styles.container}>
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
