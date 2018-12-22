import { AsyncStorage } from 'react-native';

class DeviceStorage {
    /**
   * 增
   * @param key
   * @param value
   * @returns {*}
   */
    static save(key, value) {
        return AsyncStorage.setItem(key, JSON.stringify(value));
    }
    /**
     * 删
     * @param key
     * @returns {*}
     */
    static delete(key) {
        return AsyncStorage.removeItem(key);
    }
    /**
    * 改
    * @param key
    * @param value
    * @returns {Promise<T>|Promise.<TResult>}
    */
    static update(key, value) {
        return DeviceStorage.get(key).then((item) => {
            value = typeof value === 'string' ? value : Object.assign({}, item, value);
            return AsyncStorage.setItem(key, JSON.stringify(value));
        });
    }
    /**
    * 查
    * @param key
    * @returns {Promise<T>|*|Promise.<TResult>}
    */
    static get(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            return jsonValue;
        });
    }



}

export default DeviceStorage;
