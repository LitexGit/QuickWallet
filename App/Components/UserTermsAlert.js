import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './Styles/UserTermsAlertStyle';
import Overlay from 'react-native-modal-overlay';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Metrics, Colors } from '../Themes';

export default class UserTermsAlert extends Component {

    static propTypes = {
        isShow: PropTypes.bool,
    }

    static defaultProps = {
        isShow: false
    }

    constructor (props) {
        super(props);
        this.state = {
            isOpen:true,
        };
    }

    _onPressBtn=()=>{
        this.setState({
            isOpen:false,
        });
    }

    render () {
        const {isShow} = this.props;
        const {isOpen} = this.state;
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isShow && isOpen}
                animationType='zoomIn'
                animationDuration={300}>
                <View style={styles.container}>
                    <View style={styles.topSection}>
                        <Text style={styles.titleStyle}>使用条款</Text>
                        <FontAwesome name={'compass'} size={Metrics.icons.small} color={Colors.textColor}/>
                    </View>
                    <ScrollView style={styles.scrollView}>

                    </ScrollView>
                    <TouchableOpacity onPress={()=>this._onPressBtn()}>
                        <View style={styles.bottomSection}>
                            <Text style={styles.btnTitle}>继续</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Overlay>
        );
    }
}


