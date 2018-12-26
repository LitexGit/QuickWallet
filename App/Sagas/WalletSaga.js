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
        const result = yield GethModule.init({isLogin, rawurl, passphrase});
        yield put(WalletActions.setLoading({loading:false}));
        // TODO 添加数组校验
        const address =  Ramda.head(result);
        yield put(WalletActions.savePrivateKey({address}));
        // TODO 添加地址校验
    } catch (error) {
        // TODO 初始化 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethNewAccount (action) {
    try {
        const {data:params} = action;
        const {passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));
        yield GethModule.newAccount({passphrase});
        yield put(WalletActions.setLoading({loading:false}));
        yield put(NavigationActions.navigate({routeName:'PreBackupScreen'}));
    } catch (error) {
        // TODO 新建账户 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethRandomMnemonic () {
    try {
        const result =  yield GethModule.randomMnemonic();
        // TODO 添加数组校验
        const mnemonic =  Ramda.head(result);
        // TODO 添加mnemonic校验
        yield put(WalletActions.gethRandomMnemonicSuccess({mnemonic}));
    } catch (error) {
        // TODO 生成助记词 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethImportMnemonic (action) {
    try {
        const {data:params} = action;
        const {mnemonic='', passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));
        const result = yield GethModule.importMnemonic({mnemonic, passphrase});
        yield put(WalletActions.setLoading({loading:false}));

        // TODO 添加数组校验
        const address =  Ramda.head(result);
        yield put(WalletActions.savePrivateKey({address}));
        // TODO 添加地址校验
        yield put(UserActions.registerRequest({address, type:1}));
        // TODO account ？？ ||  register ？？ ==> 备份助记词
    } catch (error) {
        // TODO 导入助记词 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethImportPrivateKey (action) {
    try {
        const {data:params} = action;
        const {privateKey='', passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));
        const gethKey = GethModule.getGethPrivateKey(privateKey);
        const result = yield GethModule.importPrivateKey({privateKey:gethKey, passphrase});
        yield put(WalletActions.setLoading({loading:false}));
        // TODO 添加数组校验
        const address =  Ramda.head(result);
        yield put(WalletActions.savePrivateKey({address}));
        // TODO 添加地址校验
        yield put(UserActions.registerRequest({address, type:1}));
        // TODO account ？？ ||  register ？？ ==> 备份助记词
    } catch (error) {
        // TODO 导入私钥 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethExportPrivateKey (action) {
    try {
        const {data:params} = action;
        const {passphrase=''} = params;

        yield put(WalletActions.setLoading({loading:true}));
        const result = yield GethModule.exportPrivateKey({passphrase});
        yield put(WalletActions.setLoading({loading:false}));
        const privateKey =  Ramda.head(result);
        const displayKey = GethModule.getDisplayedPrivateKey(privateKey);
        yield put(WalletActions.savePrivateKey({privateKey:displayKey}));
    } catch (error) {
        // TODO 导出私钥 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethTransfer (action) {
    try {
        const {data:params} = action;
        console.log('============params========================');
        console.log(params);
        console.log('============params========================');
        // const {symbol, passphrase, fromAddress, toAddress, value, gasPrice} = params;
        // TODO 参数异常校验
        yield put(WalletActions.setLoading({loading:true}));
        // const result =  yield GethModule.transfer(symbol, passphrase, fromAddress, toAddress, value, gasPrice);
        yield put(WalletActions.setLoading({loading:false}));
        // TODO 添加数组校验
        // const isSend =  Ramda.head(result);
        // console.log('================isSend====================');
        // console.log(isSend);
        // console.log('================isSend====================');
    } catch (error) {
        // TODO 生成助记词 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}


