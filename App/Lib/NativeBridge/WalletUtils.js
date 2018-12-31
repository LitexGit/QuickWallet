import { NativeModules} from 'react-native';
const gethModule = NativeModules.GethModule;

async function init({isLogin, rawurl}){
    return gethModule.init(isLogin, rawurl);
}

async function unInit(){
    return gethModule.unInit();
}

async function isUnlockAccount(){
    return await gethModule.isUnlockAccount();
}

async function unlockAccount({passphrase}){
    return await gethModule.unlockAccount(passphrase);
}

async function  newAccount({passphrase}){
    return await gethModule.newAccount(passphrase);
}

async function  randomMnemonic(){
    return await gethModule.randomMnemonic();
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

async function transfer({symbol='ETH', passphrase='', fromAddress='', toAddress='', value=0, gasPrice=0, decimal, tokenAddress}){
    const amount = value * decimal;
    gasPrice *= 1e9;
    if (symbol === 'ETH') {
        return await gethModule.transferEth(passphrase, fromAddress, toAddress, amount, gasPrice);
    }
    return await gethModule.transferTokens(passphrase, fromAddress, toAddress, tokenAddress, amount, gasPrice);
}

async function signHash({passphrase, hash}){
    return await gethModule.signHash(passphrase, hash);
}



function getDisplayedPrivateKey(key){
    const reg = RegExp(/0x/);
    if(key.match(reg)) return key;
    return '0x'+key;
}

function getGethPrivateKey(key){
    const reg = RegExp(/0x/);
    if(!key.match(reg)) return key;
    return key.replace(reg,'');
}

export default {
    init,
    unInit,
    isUnlockAccount,
    unlockAccount,
    newAccount,
    randomMnemonic,
    importMnemonic,
    importPrivateKey,
    exportPrivateKey,
    transfer,
    signHash,
    getDisplayedPrivateKey,
    getGethPrivateKey,
};
