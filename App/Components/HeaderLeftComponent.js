import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/HeaderLeftComponentStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics, Colors, Fonts } from '../Themes';

export default class HeaderLeftComponent extends Component {

    static propTypes = {
        headerBackTitle: PropTypes.string,
        onPress:PropTypes.func,
    }

    static defaultProps = {
        headerBackTitle: 'Back'
    }

    componentDidMount=()=>{
        console.log('componentDidMount');
    }

    render () {
        const {headerBackTitle, onPress} = this.props;
        return (
            <TouchableOpacity onPress={onPress}>
                <View style={styles.container}>
                    <Ionicons name={'ios-arrow-back'} size={Fonts.size.h4} color='#333333'/>
                    <Text style={styles.backTitle}>{headerBackTitle}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
