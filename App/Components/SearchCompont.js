import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { View, TouchableOpacity } from 'react-native';
import styles from './Styles/SearchCompontStyle';
import { SearchBar } from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';

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

    _onClearText=()=>{
        console.log('================_onClearText====================');
    }

    _onPressScan=()=>{
        console.log('================_onPressScan====================');

    }

    componentDidMount=()=>{
        console.log('================_componentDidMount====================');
    }


    render () {
        const {} = this.props;
        const searchBar = (
            <SearchBar
                lightTheme
                containerStyle = {styles.searchBar}
                inputStyle = {styles.inputStyle}
                onChangeText={this._onChangeText}
                onClearText={this._onClearText}
                icon={{ type: 'font-awesome', name: 'search' }}
                placeholder='搜索应用' />
        );
        return (
            <View style={styles.container}>
                <View style={styles.searchSection}>
                    {searchBar}
                    <TouchableOpacity onPress={()=>this._onPressScan()}>
                        <View style={styles.scanSection}>
                            <Ionicons name={'ios-qr-scanner'} size={24} color={'#A4A4A4'}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
