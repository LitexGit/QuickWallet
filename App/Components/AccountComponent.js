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
        address: '0xb5538753F2641A83409D2786790b42aC857C5340',
    }

    componentDidMount=()=>console.log();

    render () {
        const {address} = this.props;
        const options = {
            background: [240, 240, 240, 255],
            margin:     0.08,
            size:       64,
            saturation: 0.7,
            brightness: 0.5,
            format:     'png'
        };
        const imgData = new Identicon(address, options).toString();
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
