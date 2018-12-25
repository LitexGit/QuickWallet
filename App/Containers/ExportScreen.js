import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../Themes';
import styles from './Styles/ExportScreenStyle';
import QRCode from 'react-native-qrcode-svg';
import WalletActions from '../Redux/WalletRedux';
import Spinner from 'react-native-loading-spinner-overlay';

class ExportScreen extends Component {
  static navigationOptions = {
      title:'备份账户',
  }

_onPressBtn=()=>{
}

componentDidMount=()=>{
}

render () {
    const {loading=false, privateKey} = this.props;

    return (
        <View style={styles.container}>
            <Spinner visible={loading} cancelable
                textContent={'Loading...'}
                textStyle={styles.spinnerText}/>
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

const mapStateToProps = (state) => {
    const {
        wallet:{loading, privateKey}
    } = state;
    return { loading, privateKey };
};

const mapDispatchToProps = (dispatch) => ({
    setLoading: ({loading}) => dispatch(WalletActions.setLoading({loading})),

});

export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);
