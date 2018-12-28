import { call, put, select, all } from 'redux-saga/effects';
import UserActions from '../Redux/UserRedux';
import DeviceInfo from 'react-native-device-info';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import WalletActions from '../Redux/WalletRedux';
import { StackActions } from 'react-navigation';


export function * register (api, action) {
    const {data:params} = action;
    const {address, type} = params;
    const os = DeviceInfo.getSystemName();
    const info = {
        'deviceCountry':DeviceInfo.getDeviceCountry(),
        'deviceLocale':DeviceInfo.getDeviceLocale(),
        'deviceName':DeviceInfo.getDeviceName(),
        'bundleId':DeviceInfo.getBundleId(),
        'buildNumber':DeviceInfo.getBuildNumber(),
        'systemName':DeviceInfo.getSystemName(),
        'deviceId':DeviceInfo.getDeviceId(),
    };
    const phoneinfo = JSON.stringify(info);

    let response = yield call(api.register, {address, type, os, phoneinfo});
    response={status:true, data:{address, type, os, phoneinfo}};
    const {status, data} = response;
    if (status) {
        DeviceStorage.saveItem(Keys.IS_USER_LOGINED, true);
        yield put(UserActions.registerSuccess(data));
        return;
    }
    yield put(UserActions.registerFailure(data));
}

export function * getUserInfo (api, action) {
    const {data:params} = action;
    const {address} = params;
    const response = yield call(api.getUserInfo, {address});

    // console.log('======response==============================');
    // console.log(response);
    // console.log('======response==============================');

    // const {status, data} = response;
    // if (status) {
    //     yield put(UserActions.getUserInfoSuccess(data));
    //     return;
    // }
    // yield put(UserActions.getUserInfoFailure(data));
}


export function * logout () {
    DeviceStorage.saveItem(Keys.IS_USER_LOGINED, false);
    DeviceStorage.saveItem(Keys.IS_SELECTED_USE_TERMS, false);
    DeviceStorage.saveItem(Keys.IS_AGREED_TERMS_OF_USE, false);
    DeviceStorage.saveItem(Keys.WALLET_ADDRESS, '');

    yield put(UserActions.saveUserInfo({isLoginInfo:false}));
    yield put(UserActions.saveUserInfo({isAgreeInfo:false}));
    // 合并成一个 saveWalletInfo
    yield put(WalletActions.saveAddress({address:''}));
    yield put(WalletActions.savePrivateKey({privateKey:''}));
    yield put(WalletActions.savePassphrase({passphrase:''}));

    yield put(WalletActions.gethUnInit());

    yield put(StackActions.popToTop());
}
