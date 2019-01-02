import { NativeModules, Platform } from 'react-native';
import Ramda from 'ramda';
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
    const amount = value * 1e18;
    gasPrice *= 1e9;
    if (symbol === 'ETH') {
        return await gethModule.transferEth(passphrase, fromAddress, toAddress, amount, gasPrice);
    }
    return await gethModule.transferTokens(passphrase, fromAddress, toAddress, tokenAddress, amount, gasPrice);
}

async function sign({passphrase, signInfo}){
    console.log('=======sign======signInfo=======================');
    console.log(signInfo);
    console.log('=======sign======signInfo=======================');

    const {type=1, symbol='ETH', decimal=1e18, tokenAddress='', fromAddress='', toAddress='', value=0, gasPrice=1, msgInfo=''} = signInfo;
    switch (type) {
    case 1:{// signTx
        const amount = value * decimal;
        const gas = gasPrice * 1e9;
        if (symbol === 'ETH') { // ETH
            const ethParams = {type, symbol, fromAddress, toAddress, amount, gas};
            return await gethModule.sign(passphrase, ethParams);
        } // ERC20 token
        const tokenParams = {type, symbol, tokenAddress, fromAddress, toAddress, amount, gas};
        return await gethModule.sign(passphrase, tokenParams);
    }
    case 2: { // signMsg
        const gas = gasPrice * 1e9;
        const msgParams = {type, symbol, fromAddress, toAddress, gas, msgInfo};
        return await gethModule.sign(passphrase, msgParams);
    }

    default:
        break;
    }


}

function getResolveMap(params){
    if (Platform.OS === 'ios') {
        const result = Ramda.head(params);
        return result;
    }
    return params;
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
    sign,
    getDisplayedPrivateKey,
    getGethPrivateKey,
    getResolveMap,
};
