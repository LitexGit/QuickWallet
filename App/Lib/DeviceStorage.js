import { AsyncStorage } from 'react-native';
import StorageKeys from '../Config/constant/StorageKeys';

/**
 * 增
 * @param key
 * @param value
 * @returns {*}
 */
function setItem(key, value) {
    const data = JSON.stringify(value);
    return AsyncStorage.setItem(key, data);
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
* 查
* @param key
* @returns {Promise<T>|*|Promise.<TResult>}
*/
async function getItem(key) {
  const item = await AsyncStorage.getItem(key);
  return JSON.parse(item);
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


export  const DeviceStorage = {
    setItem,
    deleteItem,
    updateItem,
    getItem
};
export const Keys = StorageKeys;

