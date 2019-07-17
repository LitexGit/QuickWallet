
import apisauce from 'apisauce';
import Config from 'react-native-config';
import Ramda from 'ramda';

const create = (baseURL = Config.API_URL) => {
  // console.log('============Config.API_URL========================');
  // console.log(Config);
  // console.log('============Config.API_URL========================');
  const api = apisauce.create({
    baseURL,
    headers: { 'Cache-Control': 'no-cache' },
    timeout: 10000
  });
  // , 'Content-Type':'application/x-www-form-urlencoded', 'Accept':'application/x-www-form-urlencoded'

  api.addRequestTransform((request) => {
    // console.log('==========request==========================');
    // console.log(request);
    // console.log('===========request=========================');
  });

  api.addResponseTransform(response => {
    // console.log('===========response=========================');
    // console.log(response);
    // console.log('============response========================');
    const { data } = response;
    const { status, msg, data: array } = data;
    if (!array) return response;
    response.data = { status, msg, data: Ramda.head(array) };
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
  const register = (params) => api.post('/api/user/register', params);
  /**
   * 用户基本信息获取接口
   *
   * address   用户地址
   */
  const getUserInfo = ({ address }) => api.get('/api/user', { address });
  /**
   * Banner信息接口
   */
  const getBanner = () => api.get('/api/banners');
  /**
   * Dapp信息接口
   */
  const getApps = () => api.get('/api/apps');
  /**
   * 系统配置信息接口
   */
  const getConfig = () => api.get('/api/settings');
  /**
   * 获取系统支持的ERC20 token列表
   */
  const getTokenList = () => api.get('/api/tokens');


  const getRoot = () => api.get('');
  const getRate = () => api.get('rate_limit');
  const getUser = (username) => api.get('search/users', { q: username });

  return {
    register,
    getUserInfo,
    getBanner,
    getApps,
    getConfig,
    getTokenList,


    getRoot,
    getRate,
    getUser
  };
};

export default {
  create
};
