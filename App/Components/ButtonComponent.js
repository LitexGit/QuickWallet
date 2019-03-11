import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './Styles/ButtonComponentStyle';


const ButtonComponent = (props) => (<TouchableOpacity {...props}>
    <View style={styles.container}>
        {props.children}
    </View>
</TouchableOpacity>);

export default ButtonComponent;
