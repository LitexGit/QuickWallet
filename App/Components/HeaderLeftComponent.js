import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import styles from './Styles/HeaderLeftComponentStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Fonts , Metrics} from '../Themes';

export default class HeaderLeftComponent extends Component {

    static propTypes = {
        headerBackTitle: PropTypes.string,
        onPress:PropTypes.func
    }

    static defaultProps = {
        headerBackTitle: ''
    }

    componentDidMount=()=>{
        console.log('componentDidMount');
    }

    render () {
        const {headerBackTitle, onPress} = this.props;
        const leftBtn =  Platform.OS === 'ios' ? (<View style={styles.container}>
            <Ionicons name={'ios-arrow-back'}
                size={Fonts.size.h3}
                color="#333333"
            />
            <Text style={styles.backTitle}>{headerBackTitle}</Text>
        </View>) : (<View style={[styles.container, {marginLeft:Metrics.smallMargin}]}>
            <Ionicons name={'md-arrow-back'}
                size={Fonts.size.h4}
                color="#333333"
            />
        </View>);

        return (
            <TouchableOpacity onPress={onPress}>
                {leftBtn}
            </TouchableOpacity>
        );
    }
}
