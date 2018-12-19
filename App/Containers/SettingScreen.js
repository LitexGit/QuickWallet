import React, { Component } from 'react';
import { View, FlatList, TouchableOpacity, Text} from 'react-native';
import { connect } from 'react-redux';
import {SettingConfig} from '../Config/MineConfig';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Metrics , Colors } from '../Themes';

// Styles
import styles from './Styles/SettingScreenStyle';

class SettingScreen extends Component {

  static navigationOptions = {
      title:'使用设置',
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }
  _renderItem=({item})=>{
      const {key='', title='', details=''} = item;
      const nextImg = (<View>
          <MaterialIcons name={'navigate-next'} size={Metrics.icons.medium} color={Colors.textColor}/>
      </View>);

      return ( <TouchableOpacity onPress={()=>this._onPressItem(key)}>
          <View style={styles.itemContainer}>
              <Text style={styles.titleStyle}>{title}</Text>
              <View style={styles.rightSection}>
                  <Text style={styles.detailsStyle}>{details}</Text>
                  {nextImg}
              </View>
          </View>
      </TouchableOpacity>);
  }
  _renderItemSeparator= ()=><View style={styles.itemSeparator}/>

  render () {
      const settings = {'language':'简体中文', 'currency':'CNY'};

      const data = Object.values(SettingConfig).map((config)=>{
          const {key=''} = config;
          config.details = settings[key];
          return config;
      });

      return (
          <View style={styles.container}>
              <FlatList style={styles.flatList}
                  data={data}
                  keyExtractor={(item,index)=>''+index}
                  renderItem={ this._renderItem }
                  ItemSeparatorComponent = {this._renderItemSeparator}
              />
          </View>
      );
  }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingScreen);
