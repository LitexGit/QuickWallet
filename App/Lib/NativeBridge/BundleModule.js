import { NativeModules, Platform } from 'react-native';
import Ramda from 'ramda';
const bundleModule = NativeModules.BundleModule;


async function readWeb3Provider(){
    const data = await bundleModule.readWeb3Provider();
    if (Platform.OS === 'ios') {
        const result = Ramda.head(data);
        return result;
    }
    return data;
}


export default {
    readWeb3Provider,
};
