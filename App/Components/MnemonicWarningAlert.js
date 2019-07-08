import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/MnemonicWarningAlertStyle';
import Overlay from 'react-native-modal-overlay';
import Feather from 'react-native-vector-icons/Feather';
import { Metrics, Colors } from '../Themes';
import I18n from '../I18n';


export default class MnemonicWarningAlert extends Component {
    constructor(props){
        super(props);
        this.state={
            isShow:true
        };
    }

    _onPressBtn=()=>{
        this.setState({isShow:false});
    }

    render () {
        const {isShow} = this.state;
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isShow}
                animationType="zoomIn"
                animationDuration={300}
            >
                <View style={styles.container}>
                    <View style={styles.topSectiom}>
                        <Feather name={'camera-off'}
                            size={Metrics.images.medium}
                            color={Colors.textColor}
                        />
                        <Text style={styles.titleStyle}>{I18n.t('ScreenshotsTitle')}</Text>
                    </View>
                    <View style={styles.centerSectiom}>
                        <Text style={styles.remind001}>{I18n.t('ScreenshotsRemind001')}</Text>
                        <Text style={styles.remind002}>{I18n.t('ScreenshotsRemind002')}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this._onPressBtn()}>
                        <View style={styles.bottomSectiom}>
                            <Text style={styles.btnTitle}>{I18n.t('KnownAction')}</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </Overlay>
        );
    }
}
