import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity} from 'react-native';
import styles from './Styles/CommomBtnComponentStyle';
import { Colors } from '../Themes';


export default class CommomBtnComponent extends Component {
    static propTypes = {
        disabled: PropTypes.bool,
        title: PropTypes.string,
        onPress: PropTypes.func
    }

    static defaultProps = {
        disabled: false,
        title:''
    }

    componentDidMount=()=>{}

    render () {
        const {onPress, disabled, title} = this.props;
        const bgColor = disabled ? Colors.dividingLineColor : Colors.textColor;

        return (
            <TouchableOpacity disabled={disabled}
                onPress={onPress}
                style={styles.container}
            >
                <View style={[styles.contentView, {backgroundColor:bgColor}]}>
                    <Text style={styles.titleStyle}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
