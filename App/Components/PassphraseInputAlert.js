import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/PassphraseInputAlertStyle';
import Overlay from 'react-native-modal-overlay';
import I18n from '../I18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Metrics } from '../Themes';

export default class PassphraseInputAlert extends Component {
    static propTypes = {
        isInit: PropTypes.bool,
        onPressConfirm: PropTypes.func,
        onPressCancel: PropTypes.func,
    }

    static defaultProps = {
        isInit: false
    }

    constructor(props){
        super(props);
        this.password='';
        this.state={
            isShowPassword:false
        };
    }

    _onChangeText=(text)=>{
        this.password=text;
    }

    _onPressConfirm=()=>{
        this.props.onPressConfirm(this.password);
    }

    _onPressEye=()=>{
        const {isShowPassword} = this.state;
        this.setState({
            isShowPassword:!isShowPassword
        });
    }

    render () {
        const {isInit, onPressCancel} = this.props;
        const {isShowPassword} = this.state;
        const eyeView =  (<TouchableOpacity onPress={()=>this._onPressEye()} style={{justifyContent:'flex-end'}}>
            {isShowPassword ? <Ionicons name={'md-eye'} size={Metrics.icons.small} color={Colors.separateLineColor}/> : <Ionicons name={'md-eye-off'} size={Metrics.icons.small} color={Colors.separateLineColor}/>}
        </TouchableOpacity>);
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isInit}
                animationType='zoomIn'
                animationDuration={300}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>{ I18n.t('InputPswdTitle') }</Text>
                    <View style={styles.centerSection}>
                        <TextInput
                            style={styles.textInput}
                            autoFocus
                            maxLength={20}
                            secureTextEntry={isShowPassword}
                            clearButtonMode='while-editing'
                            underlineColorAndroid={'transparent'}
                            onChangeText={this._onChangeText}/>
                        {eyeView}
                    </View>
                    <View style={styles.bottomSection}>
                        <TouchableOpacity style={styles.actionView} onPress={onPressCancel}>
                            <Text style={styles.actionStyle}>{ I18n.t('CancelAction')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionView}  onPress={()=>this._onPressConfirm()}>
                            <Text style={styles.actionStyle}>{ I18n.t('ConfirmAction')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Overlay>
        );
    }
}
