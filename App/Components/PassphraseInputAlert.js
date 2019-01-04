import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/PassphraseInputAlertStyle';
import Overlay from 'react-native-modal-overlay';
import { connect } from 'react-redux';
import WalletActions from '../Redux/WalletRedux';

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
        const title = '请输入密码';
        const action001 = '取消';
        const action002 = '确认';

        const {isInit, onPressCancel} = this.props;

        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isInit}
                animationType='zoomIn'
                animationDuration={300}>
                <View style={styles.container}>
                    <Text style={styles.titleStyle}>{title}</Text>
                    <TextInput
                        style={styles.textInput}
                        autoFocus
                        maxLength={20}
                        clearButtonMode='while-editing'
                        underlineColorAndroid={'transparent'}
                        onChangeText={this._onChangeText}/>
                    <View style={styles.bottomSection}>
                        <TouchableOpacity style={styles.actionView} onPress={onPressCancel}>
                            <Text style={styles.actionStyle}>{action001}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionView}  onPress={()=>this._onPressConfirm()}>
                            <Text style={styles.actionStyle}>{action002}</Text>
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
