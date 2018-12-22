import React, { Component } from 'react';
import { View, SectionList, Text, KeyboardAvoidingView, RefreshControl, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../Themes';
import styles from './Styles/TransferRecordScreenStyle';
import ListFooterComponent from '../Components/ListFooterComponent';
import ListEmptyComponent from '../Components/ListEmptyComponent';
import { Button } from 'react-native-elements';

import { NavigationActions } from 'react-navigation';
import AssetActions from '../Redux/AssetRedux';


class TransferRecordScreen extends Component {
  static navigationOptions = {
      title:'转账记录',
  }

  componentDidMount=()=>{
      const page = 1;
      const offset = 20;
      const { getTxlist } = this.props;

      const address = '0x38bCc5B8b793F544d86a94bd2AE94196567b865c';
      getTxlist({address, page, offset});

      // const tokenSymbol = 'MKR';
      // const MKRcontractaddress = '0x875664e580eea9d5313f056d0c2a43af431c660f';
      // const MKRaddress = '0x4e83362442b8d1bec281594cea3050c8eb01311c';
      // getTxlist({address:MKRaddress, page, offset, tokenSymbol, contractAddress:MKRcontractaddress});
  }

  _onRefresh=()=>{
      console.log('===========_onRefresh=========================');
  }
  _loadMore=()=>{
      console.log('===========_loadMore=========================');
  }
  _onPressItem=()=>{
      console.log('===========_onPressItem=========================');
  }

  _onPressBtn=()=>{
      this.props.navigate('TransferScreen');
  }


  _renderItem=({item})=>{
      const {img_url='http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg',isrReceived=false, time='23:12:45', received='+2.000000ETH', payment='-2.000000ETH',address='0xHIYHBYU0xHIYHBYUBYUGYUBYU0xHIYHBYUBYUGYUBYUBYUGYUBYU', state=0} = item;
      const title = isrReceived ? '收款' : '付款';
      const from = isrReceived ? 'From:' : 'To:';

      return (<TouchableOpacity style={styles.container} onPress={()=>this._onPressItem(item)}>
          <View style={styles.itemContainer}>
              <View style={styles.itemLeft}>
                  <Image style={styles.symbolImg} source={{ uri: img_url }}/>
                  <View style={styles.itemLeftView}>
                      <Text style={styles.titleStyle}>{title}</Text>
                      <Text style={styles.timeStyle}>{time}</Text>
                  </View>
              </View>
              <View style={styles.itemRight}>
                  <View style={styles.itemRightView}>
                      <Text style={styles.titleStyle}>{received}</Text>
                      <Text style={styles.timeStyle} numberOfLines={1} ellipsizeMode='middle'>{from}{address}</Text>
                  </View>
                  <View style={styles.dotStyle}/>
              </View>
          </View>
      </TouchableOpacity>);
  }
  _renderSectionHeader=()=>(<View style={styles.sectionContainer}>
      <Text style={styles.assetsStyle}>昨天</Text>
  </View>)
  _renderListHeader=()=>{
      const item = {};
      const {img_url='http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg', symbol='ETH', count=0, assets='$1.00'} = item;
      return(<View style={styles.headerContainer}>
          <View style={styles.leftSection}>
              <Image style={styles.symbolImg} source={{ uri: img_url }}/>
              <Text style={styles.titleStyle}>{symbol}</Text>
          </View>
          <View style={styles.rightSection}>
              <Text style={styles.countStyle}>{count}</Text>
              <Text style={styles.assetsStyle}>{assets}</Text>
          </View>
      </View>);
  }
  _renderListEmpty=()=><ListEmptyComponent containerStyle={styles.emptycontainer}/>

  render () {
      const refreshing = false;
      const loading = false;
      const sections = [{'key':1, data:[{},{},{},{},{},{},{},{},{},{}]}, {'key':2, data:[{},{}]}];
      const btnTitle = '发起转账';
      const isBalance = false;

      return (
          <View style={styles.container}>
              <SectionList style={styles.sectionList}
                  refreshControl={<RefreshControl
                      refreshing={refreshing}
                      onRefresh={this._onRefresh}
                      tintColor={Colors.textColor}
                      title='Refreshing...'
                      titleColor={Colors.textColor}
                  />}
                  sections={sections}
                  extraData={this.props}
                  renderSectionHeader={this._renderSectionHeader}
                  renderItem={this._renderItem}
                  ListEmptyComponent={this._renderListEmpty}
                  ListHeaderComponent={this._renderListHeader}
                  ListFooterComponent={sections && sections.length && <ListFooterComponent
                      loading={loading}
                      onPress={this._loadMore}/>}
              />
              <View style={styles.bottomSection}>
                  <Button onPress={()=>this._onPressBtn()}
                      backgroundColor={Colors.textColor}
                      disabled={isBalance}
                      title={btnTitle}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        assets:{txlist}
    } = state;
    console.log('============txlist========================');
    console.log(txlist);
    console.log('=============txlist=======================');
    return {txlist};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    getTxlist: (params) => dispatch(AssetActions.getTxlistRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferRecordScreen);
