import { call, put, select, all } from 'redux-saga/effects';
import FoundActions from '../Redux/FoundRedux';

export default function * getPayments (api, action) {
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
