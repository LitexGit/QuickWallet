import React, { Component } from 'react';
import { View, Text } from 'react-native';
import styles from './Styles/PreMineComponentStyle';
import { connect } from 'react-redux';
import { Colors } from '../Themes';
import { Button } from 'react-native-elements';
import CreatConfig from '../Config/CreatConfig';
import { NavigationActions } from 'react-navigation';
import I18n from '../I18n';

class PreMineComponent extends Component {

    _onPressBtn = (key)=>{
        const {navigate} = this.props;
        if (key === 'creat') {
            navigate('NewWalletScreen');
            return;
        }
        navigate('ImportScreen');
    }

    render () {
        const btns = Object.values(CreatConfig).map((config, index)=>{
            const {key, backgroundColor, title, borderRadius} = config;
            const textStyle = key === 'import' ? {color:Colors.textColor} : {color:'#FFFFFF'};
            return (
                <Button key={index}
                    onPress={()=>this._onPressBtn(key)}
                    buttonStyle={styles.buttonStyle}
                    textStyle={textStyle}
                    borderRadius={borderRadius}
                    backgroundColor={backgroundColor}
                    title={title}
                />
            );
        });
        return (
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.titleStyle}>{I18n.t('CreateYourFirst')}</Text>
                    <Text style={styles.titleStyle}>{I18n.t('Layer2Account')}</Text>
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
    navigate: (route) => dispatch(NavigationActions.navigate({routeName: route}))
});

export default connect(mapStateToProps, mapDispatchToProps)(PreMineComponent);
