import React, { Component } from 'react';
import {View, Text, FlatList, ActivityIndicator, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import styles from './Styles/RefreshListviewStyle';

export const RefreshState = {
    Idle:             0,
    HeaderRefreshing: 1,
    FooterRefreshing: 2,
    NoMoreData:       3,
    Failure:          4,
    EmptyData:        5,
};

export default class RefreshListview extends Component {
    constructor (props){
        super(props);
        this.state={
        };
    }
static propTypes = {
    refreshState: PropTypes.number,
    onHeaderRefresh: PropTypes.func,
    onFooterRefresh: PropTypes.func,
    data: PropTypes.array,

    listRef: PropTypes.string,

    footerRefreshingText: PropTypes.string,
    footerFailureText: PropTypes.string,
    footerNoMoreDataText: PropTypes.string,
    footerEmptyDataText: PropTypes.string,

    footerRefreshingComponent: PropTypes.element,
    footerFailureComponent: PropTypes.element,
    footerNoMoreDataComponent: PropTypes.element,
    footerEmptyDataComponent: PropTypes.element,

    renderItem: PropTypes.func,
}

static defaultProps = {
    refreshState: RefreshState.Idle,
    onHeaderRefresh: ()=>null,
    onFooterRefresh: ()=>null,
    data: [],

    listRef: 'refreshList',

    footerRefreshingText: '数据加载中…',
    footerFailureText: '点击重新加载',
    footerNoMoreDataText: '已加载全部数据',
    footerEmptyDataText: '暂时没有相关数据',

    footerRefreshingComponent: null,
    footerFailureComponent: null,
    footerNoMoreDataComponent: null,
    footerEmptyDataComponent: null,

    renderItem: ()=>null,
}

shouldComponentUpdate = (nextProps, nextState)=>{
    if (nextProps !== this.props) {
        this.setState({
            onFooterRefresh:nextProps.onFooterRefresh
        });
    }
    return true;
}

_onRefresh=()=>{
    if (!this._shouldStartHeaderRefreshing()) return;
    const {onHeaderRefresh} = this.props;
    onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
}

_onEndReached=()=>{
    if (!this._shouldStartFooterRefreshing()) return;
    const {onFooterRefresh} = this.props;
    onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
}

_shouldStartHeaderRefreshing=()=>{
    const {refreshState} = this.props;
    if (refreshState === RefreshState.onHeaderRefresh || refreshState === RefreshState.onFooterRefresh) {
        return false;
    }
    return true;
}

_shouldStartFooterRefreshing=()=>{
    const {refreshState, data} = this.props;
    if (!data.length) {
        return false;
    }
    return refreshState === RefreshState.Idle;
}

render(){
    const { renderItem, listRef, refreshState, ...rest } = this.props;
    return (
        <FlatList
            ref={listRef}
            extraData={this.state}
            renderItem = {renderItem}
            refreshing = {refreshState === RefreshState.HeaderRefreshing}
            onRefresh = {this._onRefresh}
            onEndReachedThreshold = {0.1}
            onEndReached = {this._onEndReached}
            ListFooterComponent = {this._renderListFooter}
            {...rest}
        />
    );
}

_renderListFooter = ()=>{
    const {
        refreshState,

        footerRefreshingText,
        footerFailureText,
        footerNoMoreDataText,
        footerEmptyDataText,
        footerRefreshingComponent,
        footerFailureComponent,
        footerNoMoreDataComponent,
        footerEmptyDataComponent
    } = this.props;

    let footer = null;
    switch (refreshState) {
    case RefreshState.Idle:
        return footer = (<View style={styles.footerContainer} />);
    case RefreshState.FooterRefreshing:{
        const refreshStyle = {marginLeft: 7};
        footer = footerRefreshingComponent || (
            <View style={styles.footerContainer} >
                <ActivityIndicator size="small" color="#888888" />
                <Text style={[styles.footerText, refreshStyle]}>{footerRefreshingText}>{footerRefreshingText}</Text>
            </View>);
        return footer;
    }
    case RefreshState.NoMoreData:
        footer = footerNoMoreDataComponent || (
            <View style={styles.footerContainer} >
                <Text style={styles.footerText}>{footerNoMoreDataText}</Text>
            </View>);
        return footer;
    case RefreshState.Failure:
        footer = (
            <TouchableOpacity onPress={this._onPressFailure}>
                {footerFailureComponent || (
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>{footerFailureText}</Text>
                    </View>
                )}
            </TouchableOpacity>);
        return footer;
    case RefreshState.EmptyData:
        footer = (
            <TouchableOpacity onPress={this._onPressEmptyData}>
                {footerEmptyDataComponent || (
                    <View style={styles.footerContainer}>
                        <Text style={styles.footerText}>{footerEmptyDataText}</Text>
                    </View>
                )}
            </TouchableOpacity>);
        return footer;

    default:
        break;
    }
    return footer;
}
_onPressFailure = ()=>{
    const { data, onHeaderRefresh, onFooterRefresh} = this.props;
    if (!data.length) {
        onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
    } else {
        onFooterRefresh && onFooterRefresh(RefreshState.FooterRefreshing);
    }
}

_onPressEmptyData = ()=>{
    const {onHeaderRefresh} = this.props;
    onHeaderRefresh && onHeaderRefresh(RefreshState.HeaderRefreshing);
}
}
