import React, { Component } from 'react';
import { View, ScrollView, Text, KeyboardAvoidingView, FlatList, RefreshControl } from 'react-native';
import { connect } from 'react-redux';
import styles from './Styles/AssetsScreenStyle';
import ListEmptyComponent from '../Components/ListEmptyComponent';

class AssetsScreen extends Component {
  static navigationOptions = {
      title:'我的资产',
  }

  _onRefresh=()=>{
      console.log('============_onRefresh========================');
  }

  componentDidMount=()=>{
      console.log('===========componentDidMount=========================');
  }

  _renderItem=()=>{

  }
  _renderListHeader=()=><View/>
  _renderListEmpty=()=><ListEmptyComponent/>

  render () {
      const refreshing = false;
      return (
          <View >
              <FlatList
                  refreshControl={<RefreshControl
                      refreshing={refreshing}
                      onRefresh={this._onRefresh}
                      tintColor='red'
                      title='Refreshing...'
                      titleColor='cyan'
                  />}
                  data={[]}
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
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetsScreen);
