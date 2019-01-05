import React, { Component } from 'react';
import { ScrollView, Text, TouchableOpacity, FlatList, View} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import styles from './Styles/CurrencyScreenStyle';
import { NavigationActions } from 'react-navigation';
import { CurrencyConfig } from '../Config/MineConfig';
import Feather from 'react-native-vector-icons/Feather';
import { Metrics , Colors } from '../Themes';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';

class CurrencyScreen extends Component {
  static navigationOptions = {
      title:I18n.t('CurrencyTabTitle'),
  }

  constructor(props){
      super(props);

      this.state={
          data:[],
      };
  }

  componentDidMount() {
      const {currency } = this.props;
      this._setDataSouse(currency);
  }

  _onPressItem=(item)=>{
      this._setDataSouse(item);
  }

  _setDataSouse=(item)=>{
      const {key:selectedKey} = item;
      const data = Object.values(CurrencyConfig).map((config)=>{
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

  render () {
      const {data} = this.state;
      return (
          <ScrollView style={styles.container}>
              <FlatList style={styles.flatList}
                  data={data}
                  keyExtractor={(item,index)=>''+index}
                  renderItem={ this._renderItem }
                  ItemSeparatorComponent = {this._renderItemSeparator}/>
          </ScrollView>
      );
  }
}

const mapStateToProps = (state) => {
    console.log('============state========================');
    console.log(state);
    console.log('=============state=======================');
    const {
        user:{currency}
    } = state;
    return { currency };
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),

});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyScreen);
