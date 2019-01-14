import { NativeModules } from 'react-native';
// import {DeviceStorage, Keys} from '../DeviceStorage';
// import Config from 'react-native-config';
import { getFormatMap } from '../Format';


const layer2Module = NativeModules.Layer2Module;

async function initL2SDK({address='', socketUrl='', sendTxFunc, signMsgFunc}){
    const data = await layer2Module.initL2SDK(address);
    return getFormatMap(data);
}

function watchEvents(){
    layer2Module.watchEvents();
}

async function addPN({pnAddresss=''}){
    const data = await layer2Module.addPN(pnAddresss);
    return getFormatMap(data);
}

async function deposit({pnAddresss='', amount='0'}){
    const data = await layer2Module.deposit(pnAddresss, amount);
    return getFormatMap(data);
}

async function withdraw({pnAddresss='', amount='0'}){
    const data = await layer2Module.withdraw(pnAddresss, amount);
    return getFormatMap(data);
}

async function forceLeavePN({pnAddresss=''}){
    const data = await layer2Module.pnAddresss(pnAddresss);
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
    watchEvents,
    addPN,
    deposit,
    withdraw,
    forceLeavePN,
    sendMsg,
    queryUserInfo,
    queryTransaction,
    queryPN,
};
