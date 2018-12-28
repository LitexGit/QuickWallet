import { call, put, select, all } from 'redux-saga/effects';
import GethModule from '../Lib/NativeBridge/WalletUtils';
import WalletActions from '../Redux/WalletRedux';
import UserActions  from '../Redux/UserRedux';
import { StackActions } from 'react-navigation';
import Ramda from 'ramda';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';


export function gethInit (action) {
    try {
        const {data:params} = action;
        const {isLogin=false, rawurl=''} = params;
        GethModule.init({isLogin, rawurl});
    } catch (error) {
        // TODO 初始化 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethUnlockAccount (action) {
    try {
        const {data:params} = action;
        const {passphrase} = params;
        const result =  yield GethModule.unlockAccount({passphrase});
        const address =  Ramda.head(result);
        // TODO 解锁钱包 可以导出&&转账

        DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address); // getUserInfo

        yield put(WalletActions.saveAddress({address}));
        yield put(WalletActions.savePassphrase({passphrase}));
        yield put(UserActions.saveUserInfo({isLoginInfo:true}));

        EventEmitter.emit(EventKeys.WALLET_UNLOCKED);
    } catch (error) {
        // TODO 解锁钱包 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function *gethUnInit () {
    try {
        yield GethModule.unInit();
    } catch (error) {
        // TODO 删除文件异常处理逻辑
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
        // TODO 添加地址校验
        // yield put(UserActions.registerRequest({address, type:1}));

        // TODO account ？？ ||  register ？？ ==> 备份助记词
        DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address);
        DeviceStorage.saveItem(Keys.IS_USER_LOGINED, true);

        yield put(WalletActions.saveAddress({address}));
        yield put(WalletActions.savePassphrase({passphrase}));
        yield put(UserActions.saveUserInfo({isLoginInfo:true}));

        yield put(StackActions.popToTop());
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
        yield put(WalletActions.saveAddress({address}));

        // TODO 添加地址校验
        // yield put(UserActions.registerRequest({address, type:1}));

        // TODO account ？？ ||  register ？？ ==> 备份助记词
        DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address);
        DeviceStorage.saveItem(Keys.IS_USER_LOGINED, true);

        yield put(WalletActions.saveAddress({address}));
        yield put(WalletActions.savePassphrase({passphrase}));
        yield put(UserActions.saveUserInfo({isLoginInfo:true}));

        yield put(StackActions.popToTop());
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
        const {symbol, passphrase, fromAddress, toAddress, value, gasPrice, decimal, tokenAddress} = params;
        console.log('===================gethTransfer=================');
        console.log(tokenAddress);
        console.log('===================gethTransfer=================');
        // TODO 参数异常校验
        yield put(WalletActions.setLoading({loading:true}));
        const result =  yield GethModule.transfer({symbol, passphrase, fromAddress, toAddress, value, gasPrice, decimal, tokenAddress});
        yield put(WalletActions.setLoading({loading:false}));
        // TODO 添加数组校验
        const isSend =  Ramda.head(result);
    } catch (error) {
        // TODO 生成助记词 异常处理逻辑
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}


