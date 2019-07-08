import React, { Component } from 'react';
import { Text, TouchableOpacity, FlatList, View} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import styles from './Styles/CurrencyScreenStyle';
import { StackActions } from 'react-navigation';
import { CurrencyConfig } from '../Config/MineConfig';
import Feather from 'react-native-vector-icons/Feather';
import { Metrics , Colors } from '../Themes';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import ButtonComponent from '../Components/ButtonComponent';
import UserActions from '../Redux/UserRedux';
import AssetActions from '../Redux/AssetRedux';

class CurrencyScreen extends Component {
  static navigationOptions = {
      title:I18n.t('CurrencyTabTitle')
  }

  constructor(props){
      super(props);

      this.state={
          data:[]
      };
  }

  componentDidMount() {
      const {currency } = this.props;
      this._setDataSouse(currency);
  }

  _onPressItem=(item)=>{
      this._setDataSouse(item);
  }

  _onPressComplete=()=>{
      DeviceStorage.saveItem(Keys.MONETARY_UNIT, this.currencyItem);
      this.props.saveUserInfo({currency:this.currencyItem});
      this.props.getTokenList();
      this.props.pop();
  }

  _setDataSouse=(item)=>{
      this.currencyItem = item;
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
          <Feather name={'check'}
              size={Metrics.icons.small}
              color={Colors.textColor}
          />
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
          <View style={styles.container}>
              <FlatList style={styles.flatList}
                  data={data}
                  keyExtractor={(item,index)=>''+index}
                  renderItem={this._renderItem}
                  ItemSeparatorComponent={this._renderItemSeparator}
              />
              <ButtonComponent style={styles.btnStyle}
                  onPress={this._onPressComplete}
              >
                  <Text style={styles.btnTitle}>完成</Text>
              </ButtonComponent>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        user:{currency}
    } = state;
    return { currency };
};

const mapDispatchToProps = (dispatch) => ({
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
    getTokenList: () => dispatch(AssetActions.getTokenListRequest()),
    pop:() => dispatch(StackActions.pop())
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrencyScreen);
