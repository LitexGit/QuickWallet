import { call, put, select, all } from 'redux-saga/effects';
import Config from 'react-native-config';

import AssetActions from '../Redux/AssetRedux';

const apiKey = Config.API_URL;
const environment = 'rinkeby';
const timeout = 1000;

//https://api.etherscan.io/api?module=account&action=balance&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&tag=latest&apikey=YourApiKeyToken
export function * getBalance (action) {
    const {data:params} = action;
    const {address} = params;

    const api = require('etherscan-api').init(apiKey, environment, timeout);
    const tag='latest';
    const response =yield call(api.account.balance({address, tag}));
    console.log('============response========================');
    console.log(response);
    console.log('============response========================');

    // const {status, data} = response;
    // if (status) {
    //     yield put(ConfigActions.getConfigSuccess(data));
    //     return;
    // }
    // yield put(ConfigActions.getConfigFailure(data));
}

// http://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken
export function * getTxlist (api, action) {
    console.log('=============api=======================');
    console.log(api);
    console.log('=============action=======================');
    console.log(action);
    yield 2;
    // const response = yield call(api.getBanner, {address, type, os, phoneinfo});
    // const {status, data} = response;
    // if (status) {
    //     yield put(ConfigActions.getConfigSuccess(data));
    //     return;
    // }
    // yield put(ConfigActions.getConfigFailure(data));
}
