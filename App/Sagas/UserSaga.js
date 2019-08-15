import { call, put } from 'redux-saga/effects';
import UserActions from '../Redux/UserRedux';
import DeviceInfo from 'react-native-device-info';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import WalletActions from '../Redux/WalletRedux';
import { StackActions } from 'react-navigation';
import Toast from 'react-native-root-toast';
import BundleModule from '../Lib/NativeBridge/BundleModule';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import I18n from '../I18n';
import Ramda from 'ramda';


export function * register (api, action) {
    try {
        const {data:params} = action;
        const {address='', type=1, nickname='', isPopToTop=true} = params;

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
        const { status, msg, data } = response.data;
        const res = Ramda.head(data);

        if (status) {
            yield put(UserActions.registerSuccess(res));

            DeviceStorage.setItem(Keys.IS_USER_LOGINED, true);
            DeviceStorage.setItem(Keys.WALLET_ADDRESS, address);

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
        } else {
          Toast.show(msg, {
              shadow:true,
              position: Toast.positions.CENTER
          });
          yield put(UserActions.registerFailure());
        }
    } catch (error) {
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER
        });
    }
}

export function *getUserInfo (api, action) {
    try {
        const { data : params } = action;
        const { address } = params;
        const response = yield call(api.getUserInfo, {address});
        const { status, msg, data } = response.data;
        const res = Ramda.head(data);
        if (status) {
            yield put(UserActions.getUserInfoSuccess(res));
        } else {
          Toast.show(msg, {
              shadow:true,
              position: Toast.positions.CENTER
          });
          yield put(UserActions.getUserInfoFailure());
        }
    } catch (error) {
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER
        });
    }

}

export function * getInjectScript () {
  const web3 = yield call(BundleModule.readWeb3Provider);
  const {web3Provider} = web3;
  yield put(UserActions.saveUserInfo({web3Provider}));
}

export function * logout () {
    DeviceStorage.setItem(Keys.IS_USER_LOGINED, false);
    DeviceStorage.setItem(Keys.IS_NEW_SCREEN_DID_MOUNT, false);
    DeviceStorage.setItem(Keys.WALLET_ADDRESS, '');

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





