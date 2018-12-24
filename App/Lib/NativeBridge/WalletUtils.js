import { NativeModules} from 'react-native';
const gethModule = NativeModules.GethModule;

function init(){
    const isLogin = true;
    const rawurl = 'ws://rinkeby03.milewan.com:8546';
    const passphrase = '11111111';
    gethModule.init(isLogin, rawurl, passphrase);
}

async function  newAccount(){
    const passphrase = '11111111';
    return await gethModule.newAccount(passphrase);
}

async function importMnemonic(){
    const mnemonic = 'tag fee recycle palace nominee van dawn mail approve crash opinion scheme';
    const passphrase = '11111111';
    return await gethModule.importMnemonic(mnemonic, passphrase);
}

async function importPrivateKey(){
    const privateKey = '0x1e1066173a1cf3467ec087577d2eca919cabef5cd7db5d004fb9945cc090abce';
    const passphrase = '11111111';
    return await gethModule.importPrivateKey(privateKey, passphrase);
}

async function exportPrivateKey(){
    const passphrase = '11111111';
    return await gethModule.exportPrivateKey(passphrase);
}

export default {
    init,
    newAccount,
    importMnemonic,
    importPrivateKey,
    exportPrivateKey,
};
