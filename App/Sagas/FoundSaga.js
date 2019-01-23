import { call, put, select, all } from 'redux-saga/effects';
import FoundActions from '../Redux/FoundRedux';
import Toast from 'react-native-root-toast';

export function * getBanner (api) {

    const response = yield call(api.getBanner);
    const {data:result} = response;
    const {data, msg, status} = result;
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

export function * getApps (api) {
    const response = yield call(api.getApps);
    const {data:result} = response;
    const {data, status, msg} = result;
    if (status) {
        yield put(FoundActions.getAppsSuccess(data));
        return;
    }
    Toast.show(msg, {
        shadow:true,
        position: Toast.positions.CENTER,
    });
    yield put(FoundActions.getAppsFailure());
}
