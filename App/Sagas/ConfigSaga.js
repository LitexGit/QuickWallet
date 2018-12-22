import { call, put, select, all } from 'redux-saga/effects';
import ConfigActions from '../Redux/FoundRedux';

export function * getConfig (api, action) {
    const response = yield call(api.getConfig);
    console.log('======getConfig==============================');
    console.log(response);
    console.log('======getConfig==============================');

    // const {status, data} = response;
    // if (status) {
    //     yield put(ConfigActions.getConfigSuccess(data));
    //     return;
    // }
    // yield put(ConfigActions.getConfigFailure(data));
}

export function * getConfig001 (api, action) {
    const {data:params} = action;
    const {address, type, os, phoneinfo} = params;
    const response = yield call(api.getBanner, {address, type, os, phoneinfo});
    const {status, data} = response;
    if (status) {
        yield put(ConfigActions.getConfigSuccess(data));
        return;
    }
    yield put(ConfigActions.getConfigFailure(data));
}
