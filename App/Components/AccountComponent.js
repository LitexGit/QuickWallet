import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import styles from './Styles/AccountComponentStyle';
import  Identicon from 'identicon.js';

export default class AccountComponent extends Component {
    static propTypes = {
        address: PropTypes.string,
    }

    static defaultProps = {
        address: '',
    }

    componentDidMount=()=>console.log();

    render () {
        const {address} = this.props;
        const imgData = new Identicon(address).toString();
        const baseImg='data:image/png;base64,'+imgData;
        return (
            <View style={styles.container}>
                <View style={styles.avatar}>
                    <Image source={{uri:baseImg}} style={styles.imageStyle}/>
                </View>
                <Text style={styles.content} numberOfLines={0}>{address}</Text>
            </View>
        );
    }
}
