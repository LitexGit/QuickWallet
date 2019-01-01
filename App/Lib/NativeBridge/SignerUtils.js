import { NativeModules} from 'react-native';
const signerModule = NativeModules.SignerModule;

function notifyDappSignResult({hash}){
    console.log('==============hash======================');
    console.log(hash);
    console.log('==============hash======================');
    signerModule.notifyDappSignResult(hash);
}

function notifyDappSignResult002(){
    signerModule.notifyDappSignResult();
}

export default {
    notifyDappSignResult,
    notifyDappSignResult002,
};
