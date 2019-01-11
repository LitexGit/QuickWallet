import { call, put, select, all } from 'redux-saga/effects';
import GethModule from '../Lib/NativeBridge/WalletUtils';
import WalletActions from '../Redux/WalletRedux';
import UserActions  from '../Redux/UserRedux';
import { StackActions } from 'react-navigation';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import Toast from 'react-native-root-toast';
import {UserSelectors} from '../Redux/UserRedux';


export function *gethInit (action) {
    try {
        const {data:params} = action;
        const {isLogin=false, rawurl=''} = params;
        GethModule.init({isLogin, rawurl});
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethUnInit () {
    try {
        yield GethModule.unInit();
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
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
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethUnlockAccount (action) {
    try {
        const {data:params} = action;
        const {passphrase} = params;
        yield put(WalletActions.setLoading({loading:true}));

        const result =  yield GethModule.unlockAccount({passphrase});
        const map = GethModule.getResolveMap(result);
        const {address} = map;

        DeviceStorage.saveItem(Keys.WALLET_ADDRESS, address);
        yield put(WalletActions.saveAddress({address}));
        yield put(UserActions.saveUserInfo({passphrase, isLoginInfo:true}));
        EventEmitter.emit(EventKeys.WALLET_UNLOCKED);

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
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
        const {mnemonic} = map;

        yield put(WalletActions.gethRandomMnemonicSuccess({mnemonic}));

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
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
        const {address} = map;

        const nickname = yield select(UserSelectors.getNickname);
        yield put(UserActions.registerRequest({address, type:1, nickname}));
        yield put(UserActions.saveUserInfo({passphrase}));

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
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
        const {address} = map;

        const nickname = yield select(UserSelectors.getNickname);
        yield put(UserActions.registerRequest({address, type:1, nickname}));
        yield put(UserActions.saveUserInfo({passphrase}));

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
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
        const map = GethModule.getResolveMap(result);
        const {privateKey} = map;

        const displayKey = GethModule.getDisplayedPrivateKey(privateKey);
        yield put(WalletActions.savePrivateKey({privateKey:displayKey}));
        yield put(UserActions.saveUserInfo({passphrase}));

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

export function *gethTransfer (action) {
    try {
        const {data:params} = action;
        const {symbol, passphrase, fromAddress, toAddress, value, gasPrice, decimal, tokenAddress} = params;
        // TODO 参数异常校验
        yield put(WalletActions.setLoading({loading:true}));
        const result =  yield GethModule.transfer({symbol, passphrase, fromAddress, toAddress, value, gasPrice, decimal, tokenAddress});


        const map = GethModule.getResolveMap(result);
        const {txHash} = map;

        yield put(UserActions.saveUserInfo({passphrase}));
        yield put(WalletActions.setLoading({loading:false}));

        yield put(StackActions.pop());
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        Toast.show(error.message, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
    }
}

