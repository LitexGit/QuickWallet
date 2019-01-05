import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './Styles/PrivateKeyWarningAlertStyle';
import Overlay from 'react-native-modal-overlay';
import Entypo from 'react-native-vector-icons/Entypo';
import { Metrics } from '../Themes';
import I18n from '../I18n';

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
                        <Text style={styles.remind001}>{I18n.t('ExportRemindTitle')}</Text>
                    </View>
                    <View style={styles.centerSection}>
                        <Text style={styles.remind001}>{I18n.t('ExportRemind001')}</Text>
                        <Text style={[styles.remind001, {marginVertical:Metrics.baseMargin}]}>{I18n.t('ExportRemind002')}</Text>
                    </View>
                    <View style={styles.bottomSection}>
                        <TouchableOpacity style={styles.actionView} onPress={()=>this._onPressShow()}>
                            <Text style={styles.actionStyle}>{I18n.t('ExportAction')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        );
    }
}
