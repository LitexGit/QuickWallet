import { call, put, select, all } from 'redux-saga/effects';
import ConfigActions from '../Redux/ConfigRedux';
import Toast from 'react-native-root-toast';
import Ramda from 'ramda';

export function * getConfig (api) {
    const response = yield call(api.getConfig);
    const { status, msg, data } = response.data;
    const res = Ramda.head(data);
    if (status) {
        yield put(ConfigActions.getConfigSuccess(res));
    } else {
      Toast.show(msg, {
          shadow:true,
          position: Toast.positions.CENTER
      });
      yield put(ConfigActions.getConfigFailure());
    }
}
