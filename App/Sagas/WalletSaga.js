import { call, put, select, all } from 'redux-saga/effects';
import GethModule from '../Lib/NativeBridge/WalletUtils';
import WalletActions from '../Redux/WalletRedux';
import UserActions  from '../Redux/UserRedux';
import { StackActions ,NavigationActions} from 'react-navigation';
import {DeviceStorage, Keys} from '../Lib/DeviceStorage';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';
import Toast from 'react-native-root-toast';
import {UserSelectors} from '../Redux/UserRedux';
import I18n from '../I18n';
import { Platform } from 'react-native';

function throwError (error){

  const code = error.message;
  switch (code) {
    case '1003':{
      const msg = 'code:'+code+' '+'msg:'+I18n.t('InvalidPassword');
      Toast.show(msg, {
        shadow:true,
        position: Toast.positions.CENTER
      });
    }
      break;

    default:{
      const errCode = Platform.OS === 'ios' ? code : '1111';

      const msg = 'code:'+errCode+' '+'msg:'+I18n.t('SystemException');
      Toast.show(msg, {
        shadow:true,
        position: Toast.positions.CENTER
      });
    }
      break;
  }
}

export function *gethInit () {
    try {
        yield GethModule.init();
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
    }
}

export function *gethUnInit () {
    try {
        yield GethModule.unInit();
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
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
        throwError(error);
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

        DeviceStorage.setItem(Keys.WALLET_ADDRESS, address);
        yield put(WalletActions.saveAddress({address}));
        yield put(UserActions.saveUserInfo({isLoginInfo:true}));
        EventEmitter.emit(EventKeys.WALLET_UNLOCKED);

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
    }
}

export function *gethNewWallet(action){
    try {
        const {data:params} = action;
        const {passphrase=''} = params;
        yield put(WalletActions.setLoading({loading:true}));

        const result =  yield GethModule.randomMnemonic();
        const map = GethModule.getResolveMap(result);
        const {mnemonic} = map;
        yield put(WalletActions.gethRandomMnemonicSuccess({mnemonic}));

        const importResult = yield GethModule.importMnemonic({mnemonic, passphrase});
        const importMap = GethModule.getResolveMap(importResult);
        const {address} = importMap;

        const nickname = yield select(UserSelectors.getNickname);
        yield put(UserActions.registerRequest({address, type:1, nickname, isPopToTop:false}));

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.gethRandomMnemonicFailure());
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
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
        yield put(WalletActions.gethRandomMnemonicFailure());
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
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

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
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

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
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

        yield put(NavigationActions.navigate({routeName:'ExportScreen'}));

        yield put(WalletActions.setLoading({loading:false}));
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
    }
}

export function *gethTransfer (action) {
    try {
        yield put(WalletActions.setLoading({loading:true}));
        const {data:params} = action;
        const {symbol, passphrase, fromAddress, toAddress, value, gasPrice, decimal, tokenAddress} = params;
        const result =  yield GethModule.transfer({symbol, passphrase, fromAddress, toAddress, value, gasPrice, decimal, tokenAddress});
        const map = GethModule.getResolveMap(result);
        const {txHash} = map;
        yield put(WalletActions.setLoading({loading:false}));

        Toast.show(I18n.t('TransferSuccess'), {
            shadow:true,
            position: Toast.positions.CENTER
        });

        yield put(StackActions.pop());
    } catch (error) {
        yield put(WalletActions.setLoading({loading:false}));
        throwError(error);
    }
}



