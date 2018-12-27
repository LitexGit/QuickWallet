import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/MnemonicWarningAlertStyle';
import Overlay from 'react-native-modal-overlay';
import Feather from 'react-native-vector-icons/Feather';
import { Metrics, Colors } from '../Themes';


export default class MnemonicWarningAlert extends Component {
    constructor(props){
        super(props);
        this.state={
            isShow:true,
        };
    }

    _onPressBtn=()=>{
        this.setState({isShow:false});
    }

    render () {
        const {isShow} = this.state;
        const remind001 = '如果有人获取你的助记词将直接获取你的资产！';
        const remind002 = '账户助记词仅在此处出现一次，请抄写助记词并存放在安全的地方！';
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isShow}
                animationType='zoomIn'
                animationDuration={300}>
                <View style={styles.container}>
                    <View style={styles.topSectiom}>
                        <Feather name={'camera-off'} size={Metrics.images.medium} color={Colors.textColor}/>
                        <Text style={styles.headerText}>请勿截图</Text>
                    </View>
                    <View style={styles.centerSectiom}>
                        <Text style={styles.remind001}>{remind001}</Text>
                        <Text style={styles.remind002}>{remind002}</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this._onPressBtn()}>
                        <View style={styles.bottomSectiom}>
                            <Text style={styles.btnTitle}>我知道了</Text>
                        </View>
                    </TouchableOpacity>

                </View>
            </Overlay>
        );
    }
}
