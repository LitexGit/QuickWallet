import { call, put, select, all } from 'redux-saga/effects';
import FoundActions from '../Redux/FoundRedux';
import Toast from 'react-native-root-toast';

export function * getBanner (api) {

    const response = yield call(api.getBanner);
    console.log('======response======getBanner========================');
    console.log(response);
    console.log('======response=====getBanner========================');

    const {status, data, msg} = response;
    if (status) {
        yield put(FoundActions.getBannerSuccess(data));
        return;
    }
    Toast.show(msg, {
        shadow:true,
        position: Toast.positions.CENTER,
    });
    yield put(FoundActions.getBannerFailure());
}

export function * getBanner001 (api, action) {
    const {data:params} = action;
    const {address, type, os, phoneinfo} = params;
    const response = yield call(api.getBanner, {address, type, os, phoneinfo});
    const {status, data} = response;
    if (status) {
        yield put(FoundActions.getBannerSuccess(data));
        return;
    }

    yield put(FoundActions.getBannerFailure(data));
}
