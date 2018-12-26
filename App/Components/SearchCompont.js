import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, TouchableOpacity, TextInput} from 'react-native';
import styles from './Styles/SearchCompontStyle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { Colors } from '../Themes';


export default class SearchCompont extends Component {
    static propTypes = {
        onChangeText: PropTypes.func,
        onPressScan: PropTypes.func,
        onSubmitEditing: PropTypes.func,
        placeholder: PropTypes.string,
        setValue: PropTypes.string,
    }

    static defaultProps = {
        placeholder:'搜索应用',
        setValue:'',
    }

    componentDidMount=()=>{
        console.log('SearchCompont->componentDidMount ');
        // this.textInput.focus();
    }

    render () {
        const {placeholder, onChangeText, onPressScan, onSubmitEditing, setValue} = this.props;
        const textInput = (
            <TextInput style={styles.textInput}
                ref={(ref)=>this.textInput = ref}
                value={setValue}
                placeholder={placeholder}
                blurOnSubmit
                returnKeyType='go'
                keyboardType='url'
                placeholderTextColor={ Colors.separateLineColor }
                clearButtonMode='while-editing'
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}/>
        );
        return (
            <View style={styles.searchSection}>
                <EvilIcons style={styles.searchIcon} name={'search'} size={24} color={'#A4A4A4'}/>
                {textInput}
                <TouchableOpacity onPress={onPressScan}>
                    <View style={styles.scanSection}>
                        <Ionicons name={'ios-qr-scanner'} size={24} color={'#A4A4A4'}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

