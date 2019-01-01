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
    const hashJSON = {
        'type':1,

        'symbol':'ETH',
        'decimal':1e18,
        'tokenAddress':'0x875664e580eea9d5313f056d0c2a43af431c660f',

        'msgInfo':'我怎么这么好看，这么好看怎么办',

        'fromAddress':'0xb5538753F2641A83409D2786790b42aC857C5340',
        'toAddress':'0x38bCc5B8b793F544d86a94bd2AE94196567b865c',
        'value':1,
        'gasPrice':100,
    };

    const {type=1, symbol='ETH', decimal=1e18, tokenAddress='', fromAddress='', toAddress='', value=0, gasPrice=1, msgInfo=''} = hashJSON;
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
