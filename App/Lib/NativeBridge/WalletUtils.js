import { NativeModules, Platform } from 'react-native';
import Ramda from 'ramda';
import {getWei} from '../Format';
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

async function transfer({symbol='ETH', passphrase='', fromAddress='', toAddress='', value='0', gasPrice='0', decimal, tokenAddress}){
    const amount = getWei(value, decimal);
    const price =  getWei(gasPrice, 9);
    if (symbol === 'ETH') {
        return await gethModule.transferEth(passphrase, fromAddress, toAddress, amount, price);
    }
    return await gethModule.transferTokens(passphrase, fromAddress, toAddress, tokenAddress, amount, price);
}

async function sign({passphrase, signInfo}){
    const {type=1, symbol='ETH', decimal=18, tokenAddress='', fromAddress='', toAddress='', value='0', gasPrice='0', msgInfo=''} = signInfo;
    switch (type) {
    case 1:{

        const amount = getWei(value, decimal);
        const gas = getWei(gasPrice, 9);

        if (symbol === 'ETH') {
            const ethParams = {type, symbol, fromAddress, toAddress, amount, gas};
            return await gethModule.sign(passphrase, ethParams);
        }
        const tokenParams = {type, symbol, tokenAddress, fromAddress, toAddress, amount, gas};
        return await gethModule.sign(passphrase, tokenParams);
    }
    case 2: {
        const gas = getWei(gasPrice, 9);
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
