import React, { Component } from 'react';
import { ScrollView, Text, KeyboardAvoidingView } from 'react-native';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Metrics , Colors, Fonts, } from '../Themes';
import { Button } from 'react-native-elements';
import styles from './Styles/PreAccountScreenStyle';
import { View } from 'react-native-animatable';
import CreatConfig from '../Config/CreatConfig';
import { NavigationActions } from 'react-navigation';

class PreAccountScreen extends Component {
  static navigationOptions = {
      tabBarIcon: ({tintColor}) => (
          <Ionicons name={'md-person'} size={Metrics.bottomTabIconSize} color={tintColor}/>
      )
  }
_onPressBtn = (key)=>{
    const {navigate} = this.props;
    if (key === 'creat') {
        navigate('NewWalletScreen');
        return;
    }
    navigate('ImportScreen');
}

componentDidMount=()=>{
    console.log('===========componentDidMount=========================');
}

render () {
    const btns = Object.values(CreatConfig).map((config, index)=>{
        const {key, backgroundColor, title, borderRadius} = config;
        const textStyle = key === 'import' ? {color:Colors.textColor} : {color:'#FFFFFF'};
        return (
            <Button key={index} onPress={()=>this._onPressBtn(key)}
                buttonStyle={styles.buttonStyle}
                textStyle={textStyle}
                borderRadius={borderRadius}
                backgroundColor={backgroundColor}
                title={title}/>
        );
    });

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <Text style={styles.titleStyle}>创建你的第一个</Text>
                <Text style={styles.titleStyle}>Layer2加速账户</Text>
            </View>
            <View style={styles.bottomSection}>
                {btns}
            </View>
        </View>
    );
}
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route})),
});

export default connect(mapStateToProps, mapDispatchToProps)(PreAccountScreen);
