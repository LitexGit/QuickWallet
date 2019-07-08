import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import styles from './Styles/RightComponentStyle';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { Metrics, Colors } from '../Themes';

export default class RightComponent extends Component {

    static propTypes = {
        onPressRefresh: PropTypes.func,
        onPressShare: PropTypes.func
    }

    componentDidMount=()=>{
        console.log();
    }

    render () {
        const {onPressRefresh, onPressShare} = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={onPressRefresh}>
                    <SimpleLineIcons name={'refresh'}
                        size={Metrics.images.small}
                        color={Colors.textColor}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnStyle}
                    onPress={onPressShare}
                >
                    <SimpleLineIcons name={'share'}
                        size={Metrics.images.small}
                        color={Colors.textColor}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}
