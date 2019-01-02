
import apisauce from 'apisauce';
import Config from 'react-native-config';

const create = (baseURL = Config.API_URL||'http://wallet.milewan.com:7001') => {
    console.log('============baseURL========================');
    console.log(baseURL);
    console.log('===========baseURL=========================');
    const api = apisauce.create({
        baseURL,
        headers: {'Cache-Control': 'no-cache'},
        timeout: 10000
    });

    const getRoot = () => api.get('');
    const getRate = () => api.get('rate_limit');
    const getUser = (username) => api.get('search/users', {q: username});

    /**
     * Api 接口响应格式
     */
    // {
    //   'data':{
    //     'status':Boolean,
    //     'msg':'message'
    //     'data':{
    //       'key1':'value1',
    //       'key2':'value2'
    //       'key3':'value3'
    //       'key4':'value4'
    //       'key5':'value5'
    //     }
    //   }
    // }

    /**
     * 用户信息注册接口
     *
     * address   用户地址
     * type      1新建 2助记词导入 3私钥导入
     * os        用户系统平台 ios或android
     * phoneinfo 用户手机详细信息
     */
    const register=({address, type})=>api.put('',{address, type});
    /**
     * 用户基本信息获取接口
     *
     * address   用户地址
     */
    const getUserInfo=({address})=>api.get('',{address});
    /**
     * Banner信息接口
     */
    const getBanner=()=>api.get('');
    /**
     * 系统配置信息接口
     */
    const getConfig = () =>api.get('');
    /**
     * 获取系统支持的ERC20 token列表
     */
    const getTokenList = () =>api.get('');

    return {
        register,
        getUserInfo,
        getBanner,
        getConfig,
        getTokenList,


        getRoot,
        getRate,
        getUser,
    };
};

export default {
    create
};
