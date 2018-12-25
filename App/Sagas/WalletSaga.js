import { call, put, select, all } from 'redux-saga/effects';
import GethModule from '../Lib/NativeBridge/WalletUtils';


// const isLogin = true;
// const rawurl = 'ws://rinkeby03.milewan.com:8546';
// const passphrase = '11111111';
export function *gethInit (action) {
    const {isLogin=false, rawurl='', passphrase=''} = action;
    yield GethModule.init({isLogin, rawurl, passphrase});
}

// const passphrase = '11111111';
export function *gethNewAccount (action) {
    const {passphrase=''} = action;
    yield GethModule.newAccount({passphrase});
}

// const mnemonic = 'tag fee recycle palace nominee van dawn mail approve crash opinion scheme';
// const passphrase = '11111111';
export function *gethImportMnemonic (action) {
    const {mnemonic='', passphrase=''} = action;
    yield GethModule.importMnemonic({mnemonic, passphrase});
}

// const privateKey = '0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db5d004fb9945cc090abce';
// const passphrase = '11111111';
export function *gethImportPrivateKey (action) {
    const {privateKey='', passphrase=''} = action;
    yield GethModule.importPrivateKey({privateKey, passphrase});
}

// const passphrase = '11111111';
export function *gethExportPrivateKey (action) {
    const {passphrase=''} = action;
    yield GethModule.init({passphrase});
}


