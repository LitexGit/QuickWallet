import { call, put } from 'redux-saga/effects';
import FoundActions from '../Redux/FoundRedux';
import Toast from 'react-native-root-toast';
import Ramda from 'ramda';

export function * getBanner (api) {
    const response = yield call(api.getBanner);
    const { status, msg, data } = response.data;
    const res = Ramda.head(data);
    if (status) {
        yield put(FoundActions.getBannerSuccess(res));
    } else {
      Toast.show(msg, {
          shadow:true,
          position: Toast.positions.CENTER
      });
      yield put(FoundActions.getBannerFailure());
    }
}

export function * getApps (api) {
    const response = yield call(api.getApps);
    const { status, msg, data } = response.data;
    const res = Ramda.head(data);
    if (status) {
        yield put(FoundActions.getAppsSuccess(res));
    } else {
      Toast.show(msg, {
          shadow:true,
          position: Toast.positions.CENTER
      });
      yield put(FoundActions.getAppsFailure());
    }
}
