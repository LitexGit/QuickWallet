import React, { Component } from 'react';
import { View, Text, Clipboard, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../Themes';
import styles from './Styles/ExportScreenStyle';
import QRCode from 'react-native-qrcode-svg';
import WalletActions from '../Redux/WalletRedux';
import Spinner from 'react-native-loading-spinner-overlay';
import I18n from '../I18n';
import PrivateKeyWarningAlert from '../Components/PrivateKeyWarningAlert';
import Toast from 'react-native-root-toast';
import { StackActions } from 'react-navigation';

class ExportScreen extends Component {

  static navigationOptions = {
      title:I18n.t('ExportTabTitle'),
  }

  _onPressCopy=()=>{
      const { privateKey } = this.props;
      Clipboard.setString(privateKey);
      Toast.show(I18n.t('PrivateKeyCopied'), {
          shadow:true,
          position: Toast.positions.CENTER,
      });
  }

_onPressBtn=()=>{
    this.props.pop();
}

_onPressShow=()=>{
    const { passphrase } = this.props.navigation.state.params;
    this.props.gethExportPrivateKey({passphrase});
}

componentDidMount=()=>{
    this.props.setLoading({loading:false});
}

render () {
    //新解锁的钱包没有私钥
    const { loading=false} = this.props;
    let { privateKey} = this.props;
    if (!privateKey || !privateKey.length) {
        privateKey = '         ';
    }

    return (
        <View style={styles.container}>
            <Spinner visible={loading} cancelable
                textContent={'Loading...'}
                textStyle={styles.spinnerText}/>
            <PrivateKeyWarningAlert onPressShow={()=>this._onPressShow()}/>
            <View style={styles.topSection}>
                <View style={styles.topView}>
                    <FontAwesome name={'pencil-square-o'} size={30} color={Colors.separateLineColor}/>
                    <Text style={styles.titleStytle}>{I18n.t('BackupAccount')}</Text>
                </View>
                <TouchableOpacity onLongPress={()=>this._onPressCopy()}>
                    <Text style={styles.mnemonicText}>{privateKey}</Text>
                </TouchableOpacity>
                <QRCode value={privateKey} size={120}/>
            </View>
            <View style={styles.bottomSection}>
                <View style={styles.btnStyle}>
                    <Button onPress={()=>this._onPressBtn()}
                        backgroundColor={Colors.textColor}
                        title={ I18n.t('Complete')}/>
                </View>
            </View>
        </View>
    );
}
}

const mapStateToProps = (state) => {
    const {
        wallet:{loading, privateKey}
    } = state;
    return { loading, privateKey };
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: ({loading}) => dispatch(WalletActions.setLoading({loading})),
    gethExportPrivateKey: (params) => dispatch(WalletActions.gethExportPrivateKey(params)),
    pop:() => dispatch(StackActions.pop())
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);
