import { call, put, select, all } from 'redux-saga/effects';
import ConfigActions from '../Redux/ConfigRedux';
import Toast from 'react-native-root-toast';

export function * getConfig (api) {
    const response = yield call(api.getConfig);
    const {data:result} = response;
    const {data, status, msg} = result;
    if (status) {
        yield put(ConfigActions.getConfigSuccess(data));
        return;
    }
    Toast.show(msg, {
        shadow:true,
        position: Toast.positions.CENTER,
    });
    yield put(ConfigActions.getConfigFailure(data));
}

export function * getConfig001 () {
    yield 1;
}
