import React, { Component } from 'react';
import { Text, View, FlatList, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import {LanguageConfig} from '../Config/MineConfig';
import Feather from 'react-native-vector-icons/Feather';
import styles from './Styles/LanguageScreenStyle';
import { Metrics , Colors } from '../Themes';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import { StackActions } from 'react-navigation';
import ButtonComponent from '../Components/ButtonComponent';
import UserActions from '../Redux/UserRedux';
import ConfigActions from '../Redux/ConfigRedux';
import {Preferences, PrefKeys} from '../Lib/Preferences';
import RNExitApp from 'react-native-exit-app';

class LanguageScreen extends Component {

  static navigationOptions = {
      title:I18n.t('LanguageTabTitle'),
  }

  constructor(props){
      super(props);

      this.state={
          data:[],
      };
  }

  _onPressItem=(item)=>{
      this._setDataSouse(item);
  }

  _onPressComplete=()=>{
      const {locale} = this.languageItem;
      I18n.locale = locale;

      this.props.saveConfig({locale});

      this.props.saveUserInfo({language:this.languageItem});
      Preferences.setPrefsObjectFor(PrefKeys.LANGUAGE_ENVIRONMENT, this.languageItem);

      RNExitApp.exitApp();
      this.props.pop();
  }

  _renderItem=({item})=>{
      const {title='', isSelected} = item;
      const nextImg = (<View>
          <Feather name={'check'} size={Metrics.icons.small} color={Colors.textColor}/>
      </View>);

      return ( <TouchableOpacity onPress={()=>this._onPressItem(item)}>
          <View style={styles.itemContainer}>
              <Text style={styles.titleStyle}>{title}</Text>
              {isSelected ? nextImg : null}
          </View>
      </TouchableOpacity>);
  }
_renderItemSeparator= ()=><View style={styles.itemSeparator}/>

_setDataSouse=(item)=>{
    this.languageItem = item;
    const {key:selectedKey} = item;
    const data = Object.values(LanguageConfig).map((config)=>{
        const {key=''} = config;
        if (key === selectedKey) {
            config.isSelected = true;
        } else {
            config.isSelected = false;
        }
        return config;
    });
    this.setState({ data });
}

componentDidMount() {
    const {language } = this.props;
    this._setDataSouse(language);
}

render () {
    const {data} = this.state;
    return (
        <View style={styles.container}>
            <FlatList style={styles.flatList}
                data={data}
                keyExtractor={(item,index)=>''+index}
                renderItem={ this._renderItem }
                ItemSeparatorComponent = {this._renderItemSeparator}/>
            <ButtonComponent style={styles.btnStyle} onPress={this._onPressComplete}>
                <Text style={styles.btnTitle}>完成</Text>
            </ButtonComponent>
        </View>
    );
}
}

const mapStateToProps = (state) => {
    const {
        user:{language}
    } = state;
    return { language };
};

const mapDispatchToProps = (dispatch) => ({
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
    saveConfig: (params) => dispatch(ConfigActions.saveConfig(params)),
    pop:() => dispatch(StackActions.pop())
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageScreen);
