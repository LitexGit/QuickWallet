import { NativeModules } from 'react-native';
const layer2Module = NativeModules.Layer2Module;

async function initL2SDK(cpKey, address, socketUrl, callback){
    return layer2Module.initL2SDK(cpKey, address, socketUrl, callback);
}

async function call(command, body, callback){
    return layer2Module.call(command, body, callback);
}

export default {
    initL2SDK,
    call
};
