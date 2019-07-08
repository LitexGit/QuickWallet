import { call, put, select, all } from 'redux-saga/effects';
import UserActions from '../Redux/UserRedux';
import DeviceInfo from 'react-native-device-info';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import WalletActions from '../Redux/WalletRedux';
import { StackActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import BundleModule from '../Lib/NativeBridge/BundleModule';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import I18n from '../I18n';


export function * register (api, action) {
    try {
        const {data:params} = action;
        const {address='', type=1, nickname='', sharecode='', isPopToTop=true} = params;

        const os = DeviceInfo.getSystemName();
        const info = {
            'deviceCountry':DeviceInfo.getDeviceCountry(),
            'deviceLocale':DeviceInfo.getDeviceLocale(),
            'deviceName':DeviceInfo.getDeviceName(),
            'bundleId':DeviceInfo.getBundleId(),
            'buildNumber':DeviceInfo.getBuildNumber(),
            'systemName':DeviceInfo.getSystemName(),
            'deviceId':DeviceInfo.getDeviceId()
        };
        const phoneinfo = JSON.stringify(info);
        const response = yield call(api.register, {address, type, os, phoneinfo, nickname});
        const {data:result} = response;
        const {data, status, msg} = result;
        if (status) {
            yield put(UserActions.registerSuccess(data));

            DeviceStorage.saveItem(Keys.IS_USER_LOGINED, true);
            DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address);

            yield put(WalletActions.saveAddress({address}));
            yield put(UserActions.saveUserInfo({isLoginInfo:true}));

            if (isPopToTop) {
                yield put(StackActions.popToTop());
            } else {
                const params = {
                    status:true,
                    msg:I18n.t('CreatedWalletSuccessfully')
                };
                EventEmitter.emit(EventKeys.IS_NEW_WALLET_SUCCESS, params);
            }
            return;
        }
        Toast.show(msg, {
            shadow:true,
            position: Toast.positions.CENTER
        });
        yield put(UserActions.registerFailure());
    } catch (error) {
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER
        });
        yield put(UserActions.registerFailure());
    }
}

export function * getUserInfo (api, action) {
    try {
        const {data:params} = action;
        const {address} = params;
        const response = yield call(api.getUserInfo, {address});

        const {data:result} = response;
        const {data, status, msg} = result;
        if (status) {
            yield put(UserActions.getUserInfoSuccess(data));
            return;
        }
        Toast.show(msg, {
            shadow:true,
            position: Toast.positions.CENTER
        });
        yield put(UserActions.getUserInfoFailure());
    } catch (error) {
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER
        });
        yield put(UserActions.getUserInfoFailure());
    }

}


export function * logout () {
    DeviceStorage.saveItem(Keys.IS_USER_LOGINED, false);
    DeviceStorage.saveItem(Keys.IS_NEW_SCREEN_DID_MOUNT, false);
    DeviceStorage.saveItem(Keys.WALLET_ADDRESS, '');

    yield put(UserActions.saveUserInfo({
        isLoginInfo:false,
        address:'',
        nickname:'',
        sharecode:''
    }));

    yield put(WalletActions.savePrivateKey({privateKey:''}));

    yield put(WalletActions.gethUnInit());
    yield put(StackActions.popToTop());
}

export function * getInjectScript () {
    const web3 = yield call(BundleModule.readWeb3Provider);
    const {web3Provider} = web3;
    yield put(UserActions.saveUserInfo({web3Provider}));
}



