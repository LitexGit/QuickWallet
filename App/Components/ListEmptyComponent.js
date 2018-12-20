import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import styles from './Styles/ListEmptyComponentStyle';
import { Images } from '../Themes';
import I18n from '../I18n';

export default class ListEmptyComponent extends Component {
    static propTypes = {
        title: PropTypes.string,
    }
    static defaultProps = {
        title: '暂无记录',
    }
    componentDidMount=()=>{
        console.log('====================================');
    }
    render () {
        const {title} = this.props;
        return (
            <View style={styles.container}>
                <Image style={styles.image} source={Images.emptyImg} />
                <Text style={styles.text}>{title}</Text>
            </View>
        );
    }
}
