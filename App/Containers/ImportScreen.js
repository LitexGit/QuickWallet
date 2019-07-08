import React, { Component } from 'react';
import { View, Text, Keyboard, Animated, ScrollView, Platform} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/ImportScreenStyle';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors, Metrics } from '../Themes';
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';
import MnemonicCompont from '../Components/MnemonicCompont';
import KeyStoreCompont from '../Components/KeyStoreCompont';
import I18n from '../I18n';
import UserTermsAlert from '../Components/UserTermsAlert';


class ImportScreen extends Component {
  constructor(props){
    super(props);
    this.state={
      keyboardHeight:new Animated.Value(0)
    }
  }

  static navigationOptions = {
      title:I18n.t('ImportTabTitle')
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
    Animated.timing(this.state.keyboardHeight,{
        duration: event.duration,
        // toValue: event.endCoordinates.height,
        toValue: 50
    }).start();
  }

  _keyboardWillHide=(event)=>{
    Animated.timing(this.state.keyboardHeight,{
        duration: event.duration,
        toValue: 0
    }).start();
  }

  _onChangeTab=()=>console.log();

  render () {
      const {isAgree} = this.props;
      const userTermsView = (!isAgree ? (<View zIndex={999}
          style={styles.userTermsStyle}
                                         >
          <UserTermsAlert/>
      </View>): null);

      const connect = <View style={styles.container}>
        <View style={styles.topSection}>
                  <MaterialCommunityIcons name={'calendar-import'}
                      size={30}
                      color={Colors.separateLineColor}
                  />
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
                      onChangeTab={()=>this._onChangeTab()}
                  >
                    <View tabLabel={I18n.t('Mnemonic')}
                        style={styles.container}
                    >
                        <MnemonicCompont/>
                    </View>
                    <View tabLabel={I18n.t('PrivateKey')}
                        style={styles.container}
                    >
                        <KeyStoreCompont/>
                    </View>
                </ScrollableTabView>
            </View>
      </View>

      const connectView = Platform.OS === 'ios' ? (
        <Animated.View style={{width:'100%', height:'100%', position:'absolute', bottom:this.state.keyboardHeight}}>
          {connect}
        </Animated.View>
      ) : (
        <ScrollView style={[styles.container, {}]}>
            <View style={{width:Metrics.screenWidth,  height:Metrics.screenHeight}}>
              {connect}
            </View>
        </ScrollView>
        );

      return (
        <View style={styles.container}>
          {userTermsView}
          {connectView}
        </View>
      );
  }
}
// backgroundColor:'red'



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
