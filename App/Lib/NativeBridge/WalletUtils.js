import { NativeModules} from 'react-native';
const gethModule = NativeModules.GethModule;

async function init({isLogin, rawurl, passphrase}){
    return gethModule.init(isLogin, rawurl, passphrase);
}

async function  newAccount({passphrase}){
    return await gethModule.newAccount(passphrase);
}

async function importMnemonic({mnemonic, passphrase}){
    return await gethModule.importMnemonic(mnemonic, passphrase);
}

async function importPrivateKey({privateKey, passphrase}){
    return await gethModule.importPrivateKey(privateKey, passphrase);
}

async function exportPrivateKey({passphrase}){
    return await gethModule.exportPrivateKey(passphrase);
}

export default {
    init,
    newAccount,
    importMnemonic,
    importPrivateKey,
    exportPrivateKey,
};
