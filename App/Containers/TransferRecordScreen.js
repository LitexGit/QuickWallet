import React, { Component } from 'react';
import { View, SectionList, Text, RefreshControl, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Colors } from '../Themes';
import styles from './Styles/TransferRecordScreenStyle';
import ListFooterComponent from '../Components/ListFooterComponent';
import ListEmptyComponent from '../Components/ListEmptyComponent';
import { Button } from 'react-native-elements';

import { NavigationActions } from 'react-navigation';
import AssetActions from '../Redux/AssetRedux';
import {sectionlize} from '../Lib/Format';
import {getTxDirection} from '../Lib/Utils';
import I18n from '../I18n';


class TransferRecordScreen extends Component {
  static navigationOptions = {
      title:I18n.t('TransferRecordTabTitle'),
  }

  componentDidMount=()=>{
      const page = 1;
      const offset = 20;
      const { getTxlist } = this.props;

      const address = '0xb5538753F2641A83409D2786790b42aC857C5340';
      getTxlist({address, page, offset});

      // const tokenSymbol = 'TEST';
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
      const img_url = 'http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg';

      const { from='', to='', time='', value='', txreceipt_status='1'} = item;
      const isInput =  getTxDirection({from, to});
      const title = isInput ? '收款' : '付款';
      const direction = isInput ? 'From:'+from : 'To:'+ to;


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
                      <Text style={styles.titleStyle} numberOfLines={1}>{value}</Text>
                      <Text style={styles.timeStyle} numberOfLines={1} ellipsizeMode='middle'>{direction}</Text>
                  </View>
                  <View style={styles.dotStyle}/>
              </View>
          </View>
      </TouchableOpacity>);
  }
  _renderSectionHeader=({section})=>{
      const {key} = section;
      return (<View style={styles.sectionContainer}>
          <Text style={styles.assetsStyle}>{key}</Text>
      </View>);
  }

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
      const btnTitle = '发起转账';
      const isBalance = false;

      const {txlist} = this.props;
      return (
          <View style={styles.container}>
              <SectionList style={styles.sectionList}
                  refreshControl={<RefreshControl
                      refreshing={refreshing}
                      onRefresh={this._onRefresh}
                      tintColor={Colors.textColor}
                      title={ I18n.t('Refreshing')}
                      titleColor={Colors.textColor}
                  />}
                  sections={txlist}
                  extraData={this.props}
                  keyExtractor={(item,index)=>''+index}
                  renderSectionHeader={this._renderSectionHeader}
                  renderItem={this._renderItem}
                  ListEmptyComponent={this._renderListEmpty}
                  ListHeaderComponent={this._renderListHeader}
                  ListFooterComponent={txlist && txlist.length && <ListFooterComponent
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

    return {txlist:sectionlize(txlist)};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    getTxlist: (params) => dispatch(AssetActions.getTxlistRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferRecordScreen);
