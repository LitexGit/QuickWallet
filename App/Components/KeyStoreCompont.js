import React, { Component } from 'react';
import { connect } from 'react-redux';
// import PropTypes from 'prop-types';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/KeyStoreCompontStyle';
import { Button } from 'react-native-elements';
import { Colors, Metrics } from '../Themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WalletActions from '../Redux/WalletRedux';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from '../I18n';

class KeyStoreCompont extends Component {
    constructor (props) {
        super(props);
        this.privateKey = '';
        this.password = '';
        this.confirm = '';

        this.state = {
            isCanPress:false,
            isShowPassword:false,
        };
    }

    _onPressBtn= async ()=>{
        this.props.gethImportPrivateKey({privateKey:this.privateKey, passphrase:this.password});
    }

    _onChangePrivateKey=(text)=>{
        this.privateKey = text;
        this._checkInputIsValid();
    }

    _onChangePassword=(text)=>{
        this.password = text;
        this._checkInputIsValid();
    }

    _onChangeConfirm=(text)=>{
        this.confirm = text;
        this._checkInputIsValid();
    }

    _onPressEyeImg = ()=>{
        const {isShowPassword} = this.state;
        this.setState({
            isShowPassword:!isShowPassword
        });
    }

    componentDidMount=()=>{
        this.props.setLoading({loading:false});
        this.privateKey = '0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db5d004fb9945cc090abce';
        this._checkInputIsValid();
    }

    _checkInputIsValid=()=>{
        // TODO mnemonic 合法性校验
        if (this.privateKey.length && this.password.length > 7 &&  this.confirm.length > 7) {
            if (this.password === this.confirm) {
                this.setState({isCanPress:true});
                return;
            }
        }
        this.setState({isCanPress:false});
    }

    render () {
        const remind001 = '输入 Private Key 文件内容至输入框。或通过扫描 Private Key 内容生成的二维码录入。请留意字符大小写。';
        const remind002 = '设置新密码后,旧密码将在导入账户后失效。';
        const {isCanPress, isShowPassword} = this.state;
        const {loading} = this.props;

        const eyeImg = (
            <TouchableOpacity onPress={()=>this._onPressEyeImg()} style={{justifyContent:'center'}}>
                {isShowPassword ? <Ionicons name={'md-eye'} size={Metrics.icons.small} color={Colors.separateLineColor}/> : <Ionicons name={'md-eye-off'} size={Metrics.icons.small} color={Colors.separateLineColor}/>}
            </TouchableOpacity>);

        return (
            <View style={styles.container}>
                <Spinner visible={loading} cancelable
                    textContent={'Loading...'}
                    textStyle={styles.spinnerText}/>
                <ScrollView style={styles.container}>
                    <View style={styles.container}>
                        <View style={styles.remindView}>
                            <Text style={styles.remindText}>{remind001}</Text>
                            <Text style={[styles.remindText, {color:'red', marginTop:Metrics.smallMargin}]}>{remind002}</Text>
                        </View>
                        <View style={styles.mnemonicView}>
                            <TextInput
                                multiline
                                placeholder='输入明文私钥'
                                placeholderTextColor={ Colors.separateLineColor }
                                underlineColorAndroid={ 'transparent' }
                                style={ styles.privateKeyInput }
                                value={ this.privateKey }
                                onChangeText={(text) => this._onChangePrivateKey(text)}/>
                        </View>
                        <View style={styles.infoView}>
                            <View style={ styles.sectionView }>
                                <View style={ styles.section }>
                                    <Text style={[styles.pathText, {lineHeight:Metrics.icons.tiny}]}>设置密码</Text>
                                    <AntDesign name={'warning'} size={Metrics.icons.tiny} color={Colors.separateLineColor} style={styles.warning}/>
                                </View>
                                <View style={styles.section}>
                                    <TextInput style={styles.passwordInput}
                                        placeholder={ I18n.t('WalletPassword')}
                                        placeholderTextColor={ Colors.separateLineColor }
                                        underlineColorAndroid={ 'transparent' }
                                        clearButtonMode='while-editing'
                                        secureTextEntry={!isShowPassword}
                                        maxLength={ 20 }
                                        onChangeText={(text) => this._onChangePassword(text)}/>
                                </View>
                            </View>
                            <View style={styles.confirmView}>
                                <TextInput style={styles.section}
                                    placeholder='重复输入密码'
                                    placeholderTextColor={ Colors.separateLineColor }
                                    underlineColorAndroid={ 'transparent' }
                                    clearButtonMode='while-editing'
                                    secureTextEntry={!isShowPassword}
                                    maxLength={ 20 }
                                    onChangeText={(text) => this._onChangeConfirm(text)}/>
                                {eyeImg}
                            </View>
                        </View>
                    </View>
                    <View style={styles.botttomSection}>
                        <Button onPress={()=>this._onPressBtn()}
                            textStyle={styles.btnTitle}
                            backgroundColor={isCanPress ? Colors.textColor : Colors.separateLineColor}
                            disabled={!isCanPress}
                            title={I18n.t('Import')}/>
                    </View>
                </ScrollView>

            </View>
        );
    }
}


const mapStateToProps = (state) => {
    const {
        wallet:{loading}
    } = state;
    return {
        loading
    };
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: (params) => dispatch(WalletActions.setLoading(params)),
    gethImportPrivateKey: (params) => dispatch(WalletActions.gethImportPrivateKey(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(KeyStoreCompont);
