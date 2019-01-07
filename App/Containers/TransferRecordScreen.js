import React, { Component } from 'react';
import { View, SectionList, Text, RefreshControl, Image, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';
import { Colors, Images } from '../Themes';
import styles from './Styles/TransferRecordScreenStyle';
import ListFooterComponent from '../Components/ListFooterComponent';
import ListEmptyComponent from '../Components/ListEmptyComponent';
import { Button } from 'react-native-elements';

import { NavigationActions } from 'react-navigation';
import AssetActions from '../Redux/AssetRedux';
import {sectionlize, getToken} from '../Lib/Format';
import {getTxDirection} from '../Lib/Utils';
import I18n from '../I18n';
import Identicon from 'identicon.js';


class TransferRecordScreen extends Component {
  static navigationOptions = {
      title:I18n.t('TransferRecordTabTitle'),
  }

  constructor(props){
      super(props);
      this.state = {
          page: 1,
      };
  }

  componentDidMount=()=>{
      const page = 1;
      this._getTxlist(page);
      this.setState({ page });
  }

  _onRefresh=()=>{
      const page = 1;
      this._getTxlist(page);
      this.setState({ page });
  }

  _loadMore=()=>{
      const {refreshing, loading} = this.props;
      if (refreshing || loading) return;
      let {page} = this.state;
      page += 1;
      this.setState({
          page
      });
      this._getTxlist(page);
  }

  _getTxlist=(page)=>{
      const {selectedToken, address} = this.props;
      const offset = 20;
      const {Symbol:symbol='ETH', Tokenaddress:tokenAddress=''} = selectedToken;
      if (symbol === 'ETH') {
          this.props.getTxlist({address, page, offset, symbol});
      } else {
          this.props.getTxlist({address, page, offset, symbol, tokenAddress});
      }
  }

  _onPressBtn=()=>{
      this.props.navigate('TransferScreen');
  }


  _renderItem=({item})=>{
      const {address} = this.props;
      const { from='', to='', time='', value='', txreceipt_status='1', Decimal:decimal = 18 } = item;
      const isInput =  getTxDirection({address, from, to});
      const title = isInput ? '收款' : '付款';
      const direction = isInput ? 'From:'+from : 'To:'+ to;
      const amount = getToken(value, decimal);

      const avatar = new Identicon(direction).toString();
      const avatar_64='data:image/png;base64,'+avatar;

      const bgColor = txreceipt_status === 0 ? {backgroundColor:'#FED605'} : {backgroundColor:'green'};
      return (<TouchableOpacity style={styles.container}>
          <View style={styles.itemContainer}>
              <View style={styles.itemLeft}>
                  <Image style={styles.symbolImg} source={{ uri: avatar_64 }}/>
                  <View style={styles.itemLeftView}>
                      <Text style={styles.titleStyle}>{title}</Text>
                      <Text style={styles.timeStyle}>{time}</Text>
                  </View>
              </View>
              <View style={styles.itemRight}>
                  <View style={styles.itemRightView}>
                      <Text style={styles.titleStyle} numberOfLines={1}>{amount}</Text>
                      <Text style={styles.timeStyle} numberOfLines={1} ellipsizeMode='middle'>{direction}</Text>
                  </View>
                  <View style={[styles.dotStyle, bgColor]}/>
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
      const {selectedToken} = this.props;
      const {Symbol:symbol='', count=0, value=''} = selectedToken;
      return(<View style={styles.headerContainer}>
          <View style={styles.leftSection}>
              <Image style={styles.symbolImg} source={symbol === 'ETH' ? Images.ethIcon : Images.erc20Icon}/>
              <Text style={styles.titleStyle}>{symbol}</Text>
          </View>
          <View style={styles.rightSection}>
              <Text style={styles.countStyle}>{count}</Text>
              <Text style={styles.assetsStyle}>{value}</Text>
          </View>
      </View>);
  }
  _renderListEmpty=()=><ListEmptyComponent containerStyle={styles.emptycontainer}/>

  render () {
      const {refreshing, loading} = this.props;
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
                      title={I18n.t('TransferAction')}/>
              </View>
          </View>
      );
  }
}

const mapStateToProps = (state) => {
    const {
        user:{address},
        assets:{selectedToken, txlist, refreshing, loading, error},
    } = state;

    return {selectedToken, txlist:sectionlize(txlist), address, refreshing, loading};
};

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
    getTxlist: (params) => dispatch(AssetActions.getTxlistRequest(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TransferRecordScreen);
