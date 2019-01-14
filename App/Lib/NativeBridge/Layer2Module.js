import { NativeModules } from 'react-native';
import { getFormatMap } from '../Format';

const layer2Module = NativeModules.Layer2Module;

async function initL2SDK({cpKey='', address='', socketUrl=''}){
    const data = await layer2Module.initL2SDK(cpKey, address, socketUrl);
    return getFormatMap(data);
}

async function addPN({pnAddress=''}){
    const data = await layer2Module.addPN(pnAddress);
    return getFormatMap(data);
}

async function deposit({pnAddress='', amount='0'}){
    const data = await layer2Module.deposit(pnAddress, amount);
    return getFormatMap(data);
}

async function withdraw({pnAddress='', amount='0'}){
    const data = await layer2Module.withdraw(pnAddress, amount);
    return getFormatMap(data);
}

async function forceLeavePN({pnAddress=''}){
    const data = await layer2Module.forceLeavePN(pnAddress);
    return getFormatMap(data);
}

async function sendMsg({msg='', pnAddress='', amount='0'}){
    const data = await layer2Module.sendMsg(msg, pnAddress, amount);
    return getFormatMap(data);
}

async function queryUserInfo({ pnAddress='' }){
    const data = await layer2Module.queryUserInfo(pnAddress);
    return getFormatMap(data);
}

async function queryTransaction({pnAddress=''}){
    const data = await layer2Module.queryTransaction(pnAddress);
    return getFormatMap(data);
}

async function queryPN(){
    const data = await layer2Module.queryPN();
    return getFormatMap(data);
}

export default {
    initL2SDK,
    addPN,
    deposit,
    withdraw,
    forceLeavePN,
    sendMsg,
    queryUserInfo,
    queryTransaction,
    queryPN,
};
