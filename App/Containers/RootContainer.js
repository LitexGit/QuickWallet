import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ReduxNavigation from '../Navigation/ReduxNavigation';
import { connect } from 'react-redux';
import StartupActions from '../Redux/StartupRedux';
import ReduxPersist from '../Config/ReduxPersist';
import styles from './Styles/RootContainerStyles';

import WalletActions from '../Redux/WalletRedux';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';


class RootContainer extends Component {
    async componentDidMount  () {
        if (!ReduxPersist.active) {
            this.props.startup();
        }
        const {gethInit} = this.props;
        const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED);
        const rawurl = 'ws://rinkeby03.milewan.com:8546';
        const passphrase = '11111111';
        gethInit({isLogin, rawurl, passphrase});
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

});

export default connect(mapStateToProps, mapDispatchToProps)(RootContainer);
