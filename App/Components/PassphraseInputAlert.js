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
    }

    static defaultProps = {
        isInit: false
    }

    constructor(props){
        super(props);
        this.state={
            isShow:true,
        };
        this.password='';
    }

    _onChangeText=(text)=>{
        this.password=text;
    }

    _onPressCancel=()=>{
        this.setState({
            isShow:false,
        });
    }

    _onPressConfirm=()=>{
        // TODO 验证密码是否有效
        this.props.savePassphrase({passphrase:this.password});
        this.setState({
            isShow:false,
        });
        // TODO sign
        const {onPressConfirm} = this.props;
        onPressConfirm();
    }

    render () {
        const title = '请输入密码';
        const action001 = '取消';
        const action002 = '确认';


        const {isInit} = this.props;
        const {isShow} = this.state;
        const isOpen = isInit && isShow;
        return (
            <Overlay
                containerStyle={styles.overlay}
                childrenWrapperStyle={styles.content}
                visible={isOpen}
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
                        <TouchableOpacity style={styles.actionView} onPress={()=>this._onPressCancel()}>
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

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    savePassphrase: ({passphrase}) => dispatch(WalletActions.savePassphrase({passphrase})),
});

export default connect(mapStateToProps, mapDispatchToProps)(PassphraseInputAlert);
