import React, { Component } from 'react';
import { ScrollView, Text, View, FlatList, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import I18n from '../I18n';
import {LanguageConfig} from '../Config/MineConfig';
import Feather from 'react-native-vector-icons/Feather';
import styles from './Styles/LanguageScreenStyle';
import { Metrics , Colors } from '../Themes';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import { NavigationActions } from 'react-navigation';

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
    const {
        user:{language}
    } = state;
    return { language };
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
});

export default connect(mapStateToProps, mapDispatchToProps)(LanguageScreen);
