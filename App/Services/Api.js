
import apisauce from 'apisauce';
import Config from 'react-native-config';
import Ramda from 'ramda';

const apiUrl = 'http://wallet.milewan.com:8088';

const create = (baseURL = Config.API_URL || apiUrl) => {
    const api = apisauce.create({
        baseURL,
        headers: {'Cache-Control': 'no-cache', 'Content-Type':'application/x-www-form-urlencoded', 'Accept':'application/x-www-form-urlencoded'},
        timeout: 10000
    });

    api.addRequestTransform((request)=>{
        console.log('==========request==========================');
        console.log(request);
        console.log('===========request=========================');
    });

    api.addResponseTransform(response=>{
        console.log('===========response=========================');
        console.log(response);
        console.log('============response========================');
        const {data} = response;
        const {status, msg, data:array} = data;
        if (!array) return response;
        response.data = {status, msg, data:Ramda.head(array)};
        return response;
    });

    /**
     * 用户信息注册接口
     *
     * address   用户地址
     * type      1新建 2助记词导入 3私钥导入
     * os        用户系统平台 ios或android
     * phoneinfo 用户手机详细信息
     */
    const register=(params)=>api.post('/api/user/register',params);
    /**
     * 用户基本信息获取接口
     *
     * address   用户地址
     */
    const getUserInfo=({address})=>api.get('/api/user',{address});
    /**
     * Banner信息接口
     */
    const getBanner=()=>api.get('/api/banners');
    /**
     * 系统配置信息接口
     */
    const getConfig = () =>api.get('/api/settings');
    /**
     * 获取系统支持的ERC20 token列表
     */
    const getTokenList = () =>api.get('/api/tokens');


    const getRoot = () => api.get('');
    const getRate = () => api.get('rate_limit');
    const getUser = (username) => api.get('search/users', {q: username});

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
