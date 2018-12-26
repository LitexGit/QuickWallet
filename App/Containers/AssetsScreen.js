import React, { Component } from 'react';
import { View, Text, FlatList, RefreshControl, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/AssetsScreenStyle';
import ListEmptyComponent from '../Components/ListEmptyComponent';
import { Colors } from '../Themes';
import { NavigationActions } from 'react-navigation';
import I18n from '../I18n';

class AssetsScreen extends Component {
  static navigationOptions = {
      title:I18n.t('AccountTabTitle'),
  }

  _onRefresh=()=>{
      console.log('============_onRefresh========================');
  }

  _onPressItem=({item})=>{
      // TODO 点击切换ECR20
      this.props.navigate('TransferRecordScreen');
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  _renderItem=({item})=>{
      const {img_url='', symbol, count, assets} = item;
      return (<TouchableOpacity style={styles.container} onPress={()=>this._onPressItem(item)}>
          <View style={styles.itemContainer}>
              <View style={styles.leftSection}>
                  <Image style={styles.symbolImg} source={{ uri: img_url }}/>
                  <Text style={styles.titleStyle}>{symbol}</Text>
              </View>
              <View style={styles.rightSection}>
                  <Text style={styles.countStyle}>{count}</Text>
                  <Text style={styles.assetsStyle}>{assets}</Text>
              </View>
          </View>
      </TouchableOpacity>);
  }
  _renderListHeader=()=>(<View style={styles.headerStyle}>
      <Text style={styles.headTitle}>资产</Text>
  </View>)
  _renderListEmpty=()=><ListEmptyComponent containerStyle={styles.emptycontainer}/>

  render () {

      const refreshing = false;
      const data = [
          {'img_url':'http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg','symbol':'ETH','count':18,'assets':'$1.00'},
          {'img_url':'http://img3.imgtn.bdimg.com/it/u=3142207919,2669735180&fm=200&gp=0.jpg','symbol':'DGB','count':12,'assets':'$2.00'},
          {'img_url':'http://img18.3lian.com/d/file/201709/21/f498e01633b5b704ebfe0385f52bad20.jpg','symbol':'MKR','count':10,'assets':'$3.00'},
      ];
      return (
          <View style={styles.container}>
              <FlatList style={styles.flatList}
                  refreshControl={<RefreshControl
                      refreshing={refreshing}
                      onRefresh={this._onRefresh}
                      tintColor={Colors.textColor}
                      title='Refreshing...'
                      titleColor={Colors.textColor}
                  />}
                  data={data}
                  extraData={this.props}
                  renderItem={this._renderItem}
                  ListHeaderComponent={this._renderListHeader}
                  ListEmptyComponent={this._renderListEmpty}
              />
          </View>
      );
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetsScreen);
