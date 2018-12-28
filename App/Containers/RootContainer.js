import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import ReduxPersist from '../Config/ReduxPersist';
import styles from './Styles/RootContainerStyles';

import WalletActions from '../Redux/WalletRedux';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';

import UserActions from '../Redux/UserRedux';

class RootContainer extends Component {
    async componentDidMount  () {
        if (!ReduxPersist.active) {
            this.props.startup();
        }
        const {gethInit, saveUserInfo} = this.props;
        const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
        saveUserInfo({isLoginInfo:isLogin});

        const rawurl = 'ws://rinkeby03.milewan.com:8546';
        gethInit({isLogin, rawurl});

        const isAgree = await DeviceStorage.getItem(Keys.IS_AGREED_TERMS_OF_USE) || false;
        saveUserInfo({isAgreeInfo:isAgree});
    }
    render () {
        return (
            <View style={styles.applicationView}>
                <StatusBar barStyle='light-content' />
                <ReduxNavigation />
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
    startup: () => dispatch(StartupActions.startup()),
    gethInit: (params) => dispatch(WalletActions.gethInit(params)),
    saveUserInfo: (params) => dispatch(UserActions.saveUserInfo(params)),
});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
