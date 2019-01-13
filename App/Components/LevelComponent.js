import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import styles from './Styles/LevelComponentStyle';
import { Colors } from '../Themes';

export default class LevelComponent extends Component {

    static propTypes = {
        level: PropTypes.number,
    }

    static defaultProps = {
        level: 0
    }

    componentDidMount=()=>console.log();

    _getLevelDes=(level)=>{
        switch (level) {
        case 1:
            return '弱';
        case 2:
            return '一般';
        case 3:
            return '强';
        case 4:
            return '很好';
        default:
            return '弱';
        }

    }

    render () {
        const {level} = this.props;

        const levelArray = [4, 3, 2, 1].map((item, key)=>{
            const colorStyle = item <= level ? {backgroundColor:Colors.textColor} : {backgroundColor:Colors.separateLineColor};
            return (<View key={key} style={[styles.level, colorStyle]}>
            </View>);
        });
        return (
            <View style={styles.container}>
                <View style={[styles.section, {justifyContent:'flex-end'}]}>
                    <Text style={styles.levelDes}>{this._getLevelDes(level)}</Text>
                </View>
                <View  style={styles.section}>
                    {levelArray}
                </View>
            </View>
        );
    }
}
