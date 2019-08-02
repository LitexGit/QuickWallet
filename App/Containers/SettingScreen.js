import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Text} from 'react-native';
import { connect } from 'react-redux';
import {SettingConfig} from '../Config/MineConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Metrics , Colors } from '../Themes';
import { NavigationActions } from 'react-navigation';
import I18n from '../I18n';
import styles from './Styles/SettingScreenStyle';
import {getSettingConfigTitle} from '../Lib/Transfer'

class SettingScreen extends Component {

  static navigationOptions = ({navigation}) => {
      return {
        title: navigation.getParam('title') || I18n.t('SettingTabTitle')
      }
  }

  componentDidMount=()=>{

    setTimeout(() => {
      console.log('====================================');
      console.log(I18n.t('FoundTabBarLabel'));
      console.log(I18n.t('SettingTabTitle'));
      console.log('====================================');
    }, 1000);

      this.props.navigation.setParams({
        title: I18n.t('SettingTabTitle')
      });
  }

  _onPressItem=(key)=>{
      const {navigate} = this.props;
      switch (key) {
      case SettingConfig.language.key:
          navigate('LanguageScreen');
          break;
      case SettingConfig.currency.key:
          navigate('CurrencyScreen');
          break;
      default:
          break;
      }
  }


  _renderItem=({item})=>{
      const {key='', details=''} = item;
      const nextImg = (<View>
          <MaterialIcons name={'navigate-next'}
              size={Metrics.icons.medium}
              color={Colors.textColor}
          />
      </View>);

      return ( <TouchableOpacity onPress={()=>this._onPressItem(key)}>
          <View style={styles.itemContainer}>
              <Text style={styles.titleStyle}>{getSettingConfigTitle(key)}</Text>
              <View style={styles.rightSection}>
                  <Text style={styles.detailsStyle}>{details}</Text>
                  {nextImg}
              </View>
          </View>
      </TouchableOpacity>);
  }
  _renderItemSeparator= ()=><View style={styles.itemSeparator}/>

  render () {
      const {language, currency} = this.props;
      const settings = {language, currency};
      const data = Object.values(SettingConfig).map((config)=>{
          const {key=''} = config;
          config.details = settings[key].title;
          return config;
      });

      return (
          <View style={styles.container}>
              <FlatList style={styles.flatList}
                  data={data}
                  keyExtractor={(item,index)=>''+index}
                  renderItem={this._renderItem}
                  ItemSeparatorComponent={this._renderItemSeparator}
              />
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        user:{language, currency}
    } = state;
    return { language, currency};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route}))
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
