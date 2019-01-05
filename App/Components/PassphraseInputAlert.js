import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/PassphraseInputAlertStyle';
import Overlay from 'react-native-modal-overlay';
import { connect } from 'react-redux';
import WalletActions from '../Redux/WalletRedux';
import I18n from '../I18n';

class PassphraseInputAlert extends Component {
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
    }

    _onChangeText=(text)=>{
        this.password=text;
    }

    _onPressConfirm=()=>{
        this.props.onPressConfirm(this.password);
    }

    render () {
        const {isInit, onPressCancel} = this.props;
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isInit}
                animationType='zoomIn'
                animationDuration={300}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>{ I18n.t('InputPswdTitle') }</Text>
                    <TextInput
                        style={styles.textInput}
                        autoFocus
                        maxLength={20}
                        clearButtonMode='while-editing'
                        underlineColorAndroid={'transparent'}
                        onChangeText={this._onChangeText}/>
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

const mapDispatchToProps = (dispatch) => ({
    savePassphrase: ({passphrase}) => dispatch(WalletActions.savePassphrase({passphrase})),
});

export default connect(mapDispatchToProps)(PassphraseInputAlert);
