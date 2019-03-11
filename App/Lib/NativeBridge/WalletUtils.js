import { NativeModules, Platform } from 'react-native';
import Ramda from 'ramda';
import {getWei} from '../Format';
import Config from 'react-native-config';
import {DeviceStorage, Keys} from '../DeviceStorage';

const gethModule = NativeModules.GethModule;

async function init(){
    try {
        const isLogin = await DeviceStorage.getItem(Keys.IS_USER_LOGINED) || false;
        return gethModule.init(isLogin, Config.CONTACT_IP, Config.CHAIN_ID);
    } catch (error) {
        console.log('==========error==========================');
        console.log(error);
        console.log('==========error==========================');
    }
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


async function signMessage({address, message}){
    const result = await gethModule.signMessage(address, message);
    return getResolveMap(result);
}

async function signPersonalMessage({address, message}){
  const result = await gethModule.signPersonalMessage(address, message);
  return getResolveMap(result);
}

async function signTransaction({passphrase, signInfo}){
    // const {chainType='ETH'} = signInfo;
    const result = await gethModule.signTransaction(passphrase, signInfo);
    return getResolveMap(result);
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
    getDisplayedPrivateKey,
    getGethPrivateKey,
    getResolveMap,
    signMessage,
    signPersonalMessage,
    signTransaction,
};
