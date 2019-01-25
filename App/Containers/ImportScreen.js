import React, { Component } from 'react';
import { View, Text, Keyboard, Animated} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/ImportScreenStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../Themes';
import ScrollableTabView, { DefaultTabBar, } from 'react-native-scrollable-tab-view';
import MnemonicCompont from '../Components/MnemonicCompont';
import KeyStoreCompont from '../Components/KeyStoreCompont';
import I18n from '../I18n';
import UserTermsAlert from '../Components/UserTermsAlert';


class ImportScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      keyboardHeight:new Animated.Value(0),
    }
  }

  static navigationOptions = {
      title:I18n.t('ImportTabTitle'),
  }

  componentDidMount=()=>{
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this._keyboardWillHide);
  }

  componentWillUnmount=()=>{
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  _keyboardWillShow=(event)=>{
    console.log('===========_keyboardWillShow=========================');
    console.log(event);
    console.log('===========_keyboardWillShow=========================');
    Animated.timing(this.state.keyboardHeight,{
        duration: event.duration,
        // toValue: event.endCoordinates.height,
        toValue: 50,
    }).start();
  }

  _keyboardWillHide=(event)=>{
    console.log('===========_keyboardWillHide=========================');
    console.log(event);
    console.log('===========_keyboardWillHide=========================');
    Animated.timing(this.state.keyboardHeight,{
        duration: event.duration,
        toValue: 0,
    }).start();
  }

  _onChangeTab=()=>console.log();

  render () {
      const {keyboardHeight} = this.state;
      console.log('==========keyboardHeight==========================');
      console.log(keyboardHeight);
      console.log('==========keyboardHeight==========================');
      const {isAgree} = this.props;
      const userTermsView = (!isAgree ? (<View zIndex={999} style={styles.userTermsStyle}>
          <UserTermsAlert/>
      </View>): null);

      return (
          <View style={styles.container}>
              {userTermsView}
              <Animated.View style={{width:'100%', height:'100%', position:'absolute', bottom:keyboardHeight}}>
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
              </Animated.View>
          </View>
      );
  }
}


const mapStateToProps = (state) => {
    const {
        user:{ isAgreeInfo:isAgree }
    } = state;
    return {
        isAgree
    };
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ImportScreen);
