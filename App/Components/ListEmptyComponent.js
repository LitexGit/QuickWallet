import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, Image } from 'react-native';
import styles from './Styles/ListEmptyComponentStyle';
import { Images } from '../Themes';
import I18n from '../I18n';

export default class ListEmptyComponent extends Component {
    static propTypes = {
        title: PropTypes.string,
        containerStyle: PropTypes.object
    }
    static defaultProps = {
        title: I18n.t('NoRecord'),
        containerStyle: {}
    }

    componentDidMount=()=>console.log();

    render () {
        const {title, containerStyle} = this.props;
        return (
            <View style={[styles.container, containerStyle]}>
                <Image source={Images.emptyImg}
                    style={styles.image}
                />
                <Text style={styles.text}>{title}</Text>
            </View>
        );
    }
}
