import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../Themes';
import styles from './Styles/ExportScreenStyle';
import QRCode from 'react-native-qrcode-svg';
import GethModule from '../Lib/NativeBridge/WalletUtils';

class ExportScreen extends Component {
  static navigationOptions = {
      title:'备份账户',
  }

_onPressBtn=()=>{

}

componentDidMount= async()=>{
    const privateKey =  await GethModule.exportPrivateKey();
    console.log('=================privateKey===================');
    console.log(privateKey);
    console.log('=================privateKey===================');
}

render () {
    const privateKey = '55A0DB7143F14E22BA0EED6C58425B2E9170CD78B458EEA38B1A56BCDAFA6182';

    return (
        <View style={styles.container}>
            <View style={styles.topSection}>
                <View style={styles.topView}>
                    <FontAwesome name={'pencil-square-o'} size={30} color={Colors.separateLineColor}/>
                    <Text style={styles.titleStytle}>备份账户</Text>
                </View>
                <Text style={styles.mnemonicText}>{privateKey}</Text>
                <QRCode value={privateKey} size={120}/>
            </View>
            <View style={styles.bottomSection}>
                <View style={styles.btnStyle}>
                    <Button onPress={()=>this._onPressBtn()}
                        backgroundColor={Colors.textColor}
                        title='完成'/>
                </View>
            </View>
        </View>
    );
}
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);
