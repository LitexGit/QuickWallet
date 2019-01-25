import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import styles from './Styles/KeyStoreCompontStyle';
import { Colors, Metrics } from '../Themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WalletActions from '../Redux/WalletRedux';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from '../I18n';
import Toast from 'react-native-root-toast';
import CommomBtnComponent from '../Components/CommomBtnComponent';

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
        if (this.password.length < 8 ||  this.confirm.length < 8) {
            Toast.show(I18n.t('PswdCheckError'), {
                shadow:true,
                position: Toast.positions.CENTER,
            });
            return;
        }
        if (this.password !== this.confirm) {
            Toast.show(I18n.t('PswdConsistentError'), {
                shadow:true,
                position: Toast.positions.CENTER,
            });
            return;
        }
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
        // this.privateKey = '0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db5d004fb9945cc090abce';
        this.privateKey = '';
        this._checkInputIsValid();
    }

    _checkInputIsValid=()=>{
        if (this.privateKey.length && this.password.length  &&  this.confirm.length) {
            this.setState({isCanPress:true});
            return;
        }
        this.setState({isCanPress:false});
    }

    render () {
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
                            <Text style={styles.remindText}>{I18n.t('ImportPrivateKeyRemind')}</Text>
                            <Text style={[styles.remindText, {color:'red', marginTop:Metrics.baseMargin}]}>{I18n.t('ImportRemind')}</Text>
                        </View>
                        <View style={styles.mnemonicView}>
                            <TextInput
                                multiline
                                placeholder={I18n.t('InputPrivateKey')}
                                placeholderTextColor={ Colors.separateLineColor }
                                underlineColorAndroid={ 'transparent' }
                                style={ styles.privateKeyInput }
                                value={ this.privateKey }
                                onChangeText={(text) => this._onChangePrivateKey(text)}/>
                        </View>
                        <View style={styles.infoView}>
                            <View style={ styles.sectionView }>
                                <Text style={[styles.pathText, {lineHeight:Metrics.icons.tiny}]}>{I18n.t('SetPassword')}</Text>
                                <TextInput style={styles.passwordInput}
                                    placeholder={ I18n.t('WalletPassword')}
                                    placeholderTextColor={ Colors.separateLineColor }
                                    underlineColorAndroid={ 'transparent' }
                                    clearButtonMode='while-editing'
                                    secureTextEntry={!isShowPassword}
                                    maxLength={ 20 }
                                    onChangeText={(text) => this._onChangePassword(text)}/>
                            </View>
                            <View style={styles.confirmView}>
                                <TextInput style={styles.confirmInput}
                                    placeholder={I18n.t('RepeatPassword')}
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
                </ScrollView>
                <View style={styles.botttomSection}>
                    <CommomBtnComponent
                        disabled={!isCanPress}
                        title={I18n.t('Import')}
                        onPress={()=>this._onPressBtn()}/>
                </View>
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
