import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { View, TouchableOpacity, TextInput} from 'react-native';
import styles from './Styles/SearchCompontStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Colors, Fonts, Metrics } from '../Themes';


export default class SearchCompont extends Component {
    // // Prop type warnings
    // static propTypes = {
    //   someProperty: PropTypes.object,
    //   someSetting: PropTypes.bool.isRequired,
    // }
    //
    // // Defaults for props
    // static defaultProps = {
    //   someSetting: false
    // }

    _onChangeText=(text)=>{
        console.log('================_onChangeText====================');
        console.log(text);
    }

    _onPressScan=()=>{
        console.log('================_onPressScan====================');

    }

    _onSubmitEditing=()=>{
        console.log('================_onSubmitEditing====================');
    }


    render () {
        const textInput = (
            <TextInput style={styles.textInput}
                blurOnSubmit
                placeholder='搜索应用'
                returnKeyType='go'
                keyboardType='url'
                placeholderTextColor={ Colors.separateLineColor }
                clearButtonMode='while-editing'
                onChangeText={(text) => this._onChangeText(text)}
                onSubmitEditing={(text)=>this._onSubmitEditing(text)}/>
        );
        return (
            <View style={styles.searchSection}>
                <EvilIcons style={styles.searchIcon} name={'search'} size={24} color={'#A4A4A4'}/>
                {textInput}
                <TouchableOpacity onPress={()=>this._onPressScan()}>
                    <View style={styles.scanSection}>
                        <Ionicons name={'ios-qr-scanner'} size={24} color={'#A4A4A4'}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

