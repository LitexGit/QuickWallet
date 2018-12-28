import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/PrivateKeyWarningAlertStyle';
import Overlay from 'react-native-modal-overlay';
import Entypo from 'react-native-vector-icons/Entypo';
import { Metrics } from '../Themes';

export default class PrivateKeyWarningAlert extends Component {
    static propTypes = {
        onPressShow: PropTypes.func,
    }

    static defaultProps = {
    }

    constructor(props){
        super(props);
        this.state={
            isShow:true,
        };
    }

    _onPressShow=()=>{
        this.setState({
            isShow:false,
        });
        const {onPressShow} = this.props;
        onPressShow();
    }

    render () {
        const title = '警告';
        const content001 = '任何持有此私钥的人都可以获取账户中所有的资产,请妥善保管！';
        const content002 = '请确保周围没有其他人和摄像头';
        const action = '显示私钥';

        const {isShow} = this.state;
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible = {isShow}
                animationType='zoomIn'
                animationDuration={300}>
                <View style={styles.container}>
                    <View style={styles.topSection}>
                        <Entypo name={'warning'} size={Metrics.icons.small} color='#FED605'/>
                        <Text style={styles.remind001}>{title}</Text>
                    </View>
                    <View style={styles.centerSection}>
                        <Text style={styles.remind001}>{content001}</Text>
                        <Text style={[styles.remind001, {marginVertical:Metrics.baseMargin}]}>{content002}</Text>
                    </View>
                    <View style={styles.bottomSection}>
                        <TouchableOpacity style={styles.actionView} onPress={()=>this._onPressShow()}>
                            <Text style={styles.actionStyle}>{action}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        );
    }
}
