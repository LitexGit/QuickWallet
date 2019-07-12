import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import styles from './Styles/UserTermsAlertStyle';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Metrics, Colors } from '../Themes';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import I18n from '../I18n';
import { connect } from 'react-redux';
import UserActions from '../Redux/UserRedux';

class UserTermsAlert extends Component {

    constructor (props) {
        super(props);
        this.state = {
            isAgree:false
        };
    }

    componentDidMount=()=>{
      const {isAgree} = this.props;
      this.setState({ isAgree });
  }

    _onPressBtn=()=>{
        DeviceStorage.setItem(Keys.IS_AGREED_TERMS_OF_USE, true);
        this.props.saveUserInfo({isAgreeInfo:true});
    }
    _onPressReadBtn=()=>{
        const {isAgree} = this.state;
        this.setState({ isAgree:!isAgree });
    }

    render () {
        const remin001 = '我已仔细阅读并同意以上条款以及';
        const remin002 = 'Cookiss的使用说明';

        const {isAgree} = this.state;
        const agreedImg = isAgree ? <AntDesign name={'checkcircle'}
            size={Metrics.icons.small}
            color={Colors.textColor}
                                    /> : <AntDesign name={'checkcircleo'}
                                        size={Metrics.icons.small}
                                        color={Colors.separateLineColor}
                                         />;
        const btnStyle = isAgree ? {backgroundColor:Colors.textColor} : {backgroundColor:Colors.dividingLineColor};
        return (
            <View style={styles.container}>
                <View style={styles.topSection}>
                    <Text style={styles.titleStyle}>{I18n.t('TermsOfUse')}</Text>
                    {/* <FontAwesome name={'compass'} size={Metrics.icons.small} color={Colors.textColor}/> */}
                </View>
                <ScrollView style={styles.scrollView}>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text>{remin001}{remin002}</Text>
                    <Text/>
                </ScrollView>
                <View style={styles.bottomContent}>
                    <TouchableOpacity onPress={()=>this._onPressReadBtn()}>
                        {agreedImg}
                    </TouchableOpacity>
                    <View style={styles.remindView}>
                        <Text style={styles.remind}>{I18n.t('ConfirmRemind001')}</Text>
                        <Text style={[styles.remind, {marginTop:Metrics.smallMargin, color:Colors.textColor}]}>{I18n.t('ConfirmRemind002')}</Text>
                    </View>
                </View>
                <TouchableOpacity disabled={!isAgree}
                    onPress={()=>this._onPressBtn()}
                >
                    <View style={[styles.bottomSection, btnStyle]}>
                        <Text style={styles.btnTitle}>{I18n.t('Continue')}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    const {
        user:{
            isAgreeInfo:isAgree
        }
    } = state;
    return {
        isAgree
    };
};

const mapDispatchToProps = (dispatch) => ({
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params))

});

export default connect(mapStateToProps, mapDispatchToProps)(UserTermsAlert);


