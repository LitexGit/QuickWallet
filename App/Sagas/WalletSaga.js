import { call, put, select, all } from 'redux-saga/effects';
import GethModule from '../Lib/NativeBridge/WalletUtils';
import WalletActions from '../Redux/WalletRedux';
import UserActions  from '../Redux/UserRedux';
import { NavigationActions } from 'react-navigation';

import Ramda from 'ramda';


export function *gethInit (action) {
    try {
        const {data:params} = action;
        const {isLogin=false, rawurl='', passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));
        yield GethModule.init({isLogin, rawurl, passphrase});
        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        // TODO 初始化 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }


}

// const passphrase = '11111111';
export function *gethNewAccount (action) {
    const {data:params} = action;
    const {passphrase=''} = params;
    yield put(WalletActions.setLoading({loading:true}));
    yield GethModule.newAccount({passphrase});
    yield put(WalletActions.setLoading({loading:false}));
    yield put(NavigationActions.navigate({routeName:'PreBackupScreen'}));
}


export function *gethRandomMnemonic () {
    const result =  yield GethModule.randomMnemonic();
    // TODO 添加数组校验
    const mnemonic =  Ramda.head(result);
    // TODO 添加mnemonic校验
    yield put(WalletActions.gethRandomMnemonicSuccess({mnemonic}));
}

// const mnemonic = 'tag fee recycle palace nominee van dawn mail approve crash opinion scheme';
// const passphrase = '11111111';
export function *gethImportMnemonic (action) {
    const {data:params} = action;
    const {mnemonic='', passphrase=''} = params;
    yield put(WalletActions.setLoading({loading:true}));
    const result = yield GethModule.importMnemonic({mnemonic, passphrase});
    yield put(WalletActions.setLoading({loading:false}));

    // TODO 添加数组校验
    const address =  Ramda.head(result);
    // TODO 添加地址校验
    yield put(UserActions.registerRequest({address, type:1}));
    // TODO account ？？ ||  register ？？ ==> 备份助记词
}

// const privateKey = '0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db5d004fb9945cc090abce';
// const passphrase = '11111111';
export function *gethImportPrivateKey (action) {
    const {data:params} = action;
    const {privateKey='', passphrase=''} = params;
    yield put(WalletActions.setLoading({loading:true}));
    yield GethModule.importPrivateKey({privateKey, passphrase});
    yield put(WalletActions.setLoading({loading:false}));
}

// const passphrase = '11111111';
export function *gethExportPrivateKey (action) {
    const {data:params} = action;
    const {passphrase=''} = params;
    yield put(WalletActions.setLoading({loading:true}));
    yield GethModule.init({passphrase});
    yield put(WalletActions.setLoading({loading:false}));
}


