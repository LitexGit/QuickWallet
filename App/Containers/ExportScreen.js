import React, { Component } from 'react';
import { View, Text, Clipboard, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Colors } from '../Themes';
import styles from './Styles/ExportScreenStyle';
import QRCode from 'react-native-qrcode-svg';
import I18n from '../I18n';
import PrivateKeyWarningAlert from '../Components/PrivateKeyWarningAlert';
import Toast from 'react-native-root-toast';
import { StackActions } from 'react-navigation';
import CommomBtnComponent from '../Components/CommomBtnComponent';

class ExportScreen extends Component {

  static navigationOptions = {
      title:I18n.t('ExportTabTitle'),
  }

  constructor(props){
      super(props);
      this.state={
          privateKey:' '
      };
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
    const { privateKey} = this.props;
    this.setState({ privateKey });
}

render () {
    const {privateKey} = this.state;
    return (
        <View style={styles.container}>
            <PrivateKeyWarningAlert onPressShow={()=>this._onPressShow()}/>
            <View style={styles.topSection}>
                <View style={styles.topView}>
                    <FontAwesome name={'pencil-square-o'} size={30} color={Colors.separateLineColor}/>
                    <Text style={styles.titleStytle}>{I18n.t('BackupAccount')}</Text>
                </View>
                <TouchableOpacity onPress={()=>this._onPressCopy()}>
                    <Text style={styles.mnemonicText}>{privateKey}</Text>
                </TouchableOpacity>
                <QRCode value={privateKey} size={120}/>
            </View>
            <View style={styles.bottomSection}>
                <View style={styles.btnStyle}>
                    <CommomBtnComponent
                        title={ I18n.t('Complete')}
                        onPress={()=>this._onPressBtn()}/>
                </View>
            </View>
        </View>
    );
}
}

const mapStateToProps = (state) => {
    const {
        wallet:{privateKey}
    } = state;
    return {privateKey };
};

const mapDispatchToProps = (dispatch) => ({
    pop:() => dispatch(StackActions.pop())
});

export default connect(mapStateToProps, mapDispatchToProps)(ExportScreen);
