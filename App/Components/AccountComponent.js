import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from './Styles/AccountComponentStyle';

export default class AccountComponent extends Component {
    static propTypes = {
        address: PropTypes.string,
    }

    static defaultProps = {
        address: '0xb5538753F2641A83409D2786790b42aC857C5340',
    }
    componentDidMount=()=>{
        // TODO 根据 address 生成 avatar
    }

    render () {
        const {address} = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.avatar}></View>
                <Text style={styles.content} numberOfLines={0}>{address}</Text>
            </View>
        );
    }
}
