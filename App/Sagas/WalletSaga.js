import { call, put, select, all } from 'redux-saga/effects';
import GethModule from '../Lib/NativeBridge/WalletUtils';
import SignerModule from '../Lib/NativeBridge/SignerUtils';
import WalletActions from '../Redux/WalletRedux';
import UserActions  from '../Redux/UserRedux';
import { StackActions } from 'react-navigation';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import Toast from 'react-native-root-toast';
import {UserSelectors} from '../Redux/UserRedux';



export function gethInit (action) {
    try {
        const {data:params} = action;
        const {isLogin=false, rawurl=''} = params;
        GethModule.init({isLogin, rawurl});
    } catch (error) {
        const errMsg = 'RN:初始化异常';
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethUnInit () {
    try {
        yield GethModule.unInit();
    } catch (error) {
        const errMsg = 'RN:反初始化异常';
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethIsUnlockAccount () {
    try {
        const result =  yield GethModule.isUnlockAccount();

        const map = GethModule.getResolveMap(result);
        const {isUnlock} = map;
        EventEmitter.emit(EventKeys.IS_UNLOCK_ACCOUNT, {isUnlock});
    } catch (error) {
        const errMsg = 'RN:校验异常';
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethUnlockAccount (action) {
    try {
        const {data:params} = action;
        const {passphrase} = params;

        const result =  yield GethModule.unlockAccount({passphrase});
        const map = GethModule.getResolveMap(result);
        console.log('=============gethUnlockAccount=======================');
        console.log(map);
        console.log('=============gethUnlockAccount=======================');

        const {address} = map;
        // TODO 解锁钱包 可以导出&&转账
        DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address); // getUserInfo

        yield put(WalletActions.saveAddress({address}));
        yield put(WalletActions.savePassphrase({passphrase}));
        yield put(UserActions.saveUserInfo({isLoginInfo:true}));

        EventEmitter.emit(EventKeys.WALLET_UNLOCKED);
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        // TODO 解锁钱包 异常处理逻辑
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}


export function *gethRandomMnemonic () {
    try {
        yield put(WalletActions.setLoading({loading:true}));
        const result =  yield GethModule.randomMnemonic();
        const map = GethModule.getResolveMap(result);
        yield put(WalletActions.setLoading({loading:false}));

        const {mnemonic} = map;
        yield put(WalletActions.gethRandomMnemonicSuccess({mnemonic}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethImportMnemonic (action) {
    try {
        const {data:params} = action;
        const {mnemonic='', passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));
        const result = yield GethModule.importMnemonic({mnemonic, passphrase});
        const map = GethModule.getResolveMap(result);
        yield put(WalletActions.setLoading({loading:false}));

        const {address} = map;
        const nickname = yield select(UserSelectors.getNickname);
        yield put(UserActions.registerRequest({address, type:1, nickname}));

        yield put(WalletActions.savePassphrase({passphrase}));

    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethImportPrivateKey (action) {
    try {
        const {data:params} = action;
        const {privateKey='', passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));
        const gethKey = GethModule.getGethPrivateKey(privateKey);
        const result = yield GethModule.importPrivateKey({privateKey:gethKey, passphrase});
        const map = GethModule.getResolveMap(result);
        yield put(WalletActions.setLoading({loading:false}));

        const {address} = map;
        const nickname = yield select(UserSelectors.getNickname);
        yield put(UserActions.registerRequest({address, type:1, nickname}));

        // DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address);
        // DeviceStorage.saveItem(Keys.IS_USER_LOGINED, true);
        // yield put(WalletActions.saveAddress({address}));
        // yield put(WalletActions.savePassphrase({passphrase}));
        // yield put(UserActions.saveUserInfo({isLoginInfo:true}));
        // yield put(StackActions.popToTop());

    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethExportPrivateKey (action) {
    try {
        const {data:params} = action;
        const {passphrase=''} = params;

        yield put(WalletActions.setLoading({loading:true}));
        const result = yield GethModule.exportPrivateKey({passphrase});
        yield put(WalletActions.setLoading({loading:false}));

        const map = GethModule.getResolveMap(result);
        console.log('=============gethExportPrivateKey=======================');
        console.log(map);
        console.log('=============gethExportPrivateKey=======================');

        const {privateKey} = map;
        const displayKey = GethModule.getDisplayedPrivateKey(privateKey);
        yield put(WalletActions.savePrivateKey({privateKey:displayKey}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
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

        const map = GethModule.getResolveMap(result);
        console.log('=============gethTransfer=======================');
        console.log(map);
        console.log('=============gethTransfer=======================');

        const {isSend} = map;
        // 交易成功 失败 ==> 详细处理逻辑
        yield put(StackActions.pop());
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethSignHash (action) {
    try {
        const {data:params} = action;
        const {passphrase, signInfo} = params;
        yield put(WalletActions.setLoading({loading:false}));
        const result = yield GethModule.sign({passphrase, signInfo});
        yield put(WalletActions.setLoading({loading:false}));

        const map = GethModule.getResolveMap(result);
        console.log('=============gethSignHash=======================');
        console.log(map);
        console.log('=============gethSignHash=======================');

        const {infoHash} = map;
        yield SignerModule.notifyDappSignResult({hash:infoHash});
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        const {userInfo, code} = error;
        const errMsg = code+':' + JSON.stringify(userInfo);
        Toast.show(errMsg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

