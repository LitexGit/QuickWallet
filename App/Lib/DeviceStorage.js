import { AsyncStorage } from 'react-native';
import StorageKeys from '../Config/constant/StorageKeys';

/**
 * 增
 * @param key
 * @param value
 * @returns {*}
 */
function saveItem(key, value) {
    return AsyncStorage.setItem(key, JSON.stringify(value));
}
/**
 * 删
 * @param key
 * @returns {*}
 */
function deleteItem(key) {
    return AsyncStorage.removeItem(key);
}
/**
* 改
* @param key
* @param value
* @returns {Promise<T>|Promise.<TResult>}
*/
async function updateItem(key, value) {
    const item = await getItem.get(key);
    if (typeof value !== 'string') {
        value = Object.assign({}, item, value);
    }
    return AsyncStorage.setItem(key, JSON.stringify(value));
}
/**
* 查
* @param key
* @returns {Promise<T>|*|Promise.<TResult>}
*/
async function getItem(key) {
    const item = await AsyncStorage.getItem(key);
    return JSON.parse(item);
}

export  const DeviceStorage = {
    saveItem,
    deleteItem,
    updateItem,
    getItem,
};
export const Keys = StorageKeys;

