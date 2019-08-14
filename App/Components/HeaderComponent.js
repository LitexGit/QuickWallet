import React, { Component } from 'react'
import { View, Text, StatusBar, TouchableOpacity, TextInput } from 'react-native'
import styles from './Styles/HeaderComponentStyle'
import PropTypes from 'prop-types';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

export default class HeaderComponent extends Component {
  static propTypes = {
    setValue: PropTypes.func,
    onChangeText: PropTypes.func,
    onPressScan: PropTypes.func,
    onSubmitEditing: PropTypes.func
  }

  static defaultProps = {
    placeholder: '搜索/输入Dapp网址',
    setValue:()=>''
}

  render () {
    const {setValue, placeholder, onChangeText, onSubmitEditing} = this.props;
    return (
      <View style={styles.container}>
        <StatusBar
            barStyle="dark-content"
            backgroundColor="red"
        />
        <View style={[styles.content]}>
          <View style={styles.search}>
            <EvilIcons style={{marginLeft: 6}}
                name={'search'}
                size={24}
                color={'#A4A4A4'}
            />
            <TextInput style={styles.textInput}
                ref={(ref)=>this.textInput = ref}
                value={setValue}
                placeholder={placeholder}
                blurOnSubmit
                returnKeyType="go"
                keyboardType="url"
                clearButtonMode="while-editing"
                onChangeText={onChangeText}
                onSubmitEditing={onSubmitEditing}
            />

          </View>
          <TouchableOpacity onPress={this.props.onPressCancel}>
            <Text style={styles.cancel}>取消</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
