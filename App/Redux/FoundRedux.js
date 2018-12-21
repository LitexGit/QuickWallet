import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    getBannerRequest: ['data'],
    getBannerSuccess: ['data'],
    getBannerFailure: null,
});

export const FoundTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
/**
 * banner
 *
 * url   点击banner后打开的连接
 * image banner图片
 * type  1用webview打开链接 2跳转到app特定页面
 */

const bannerList = [
    {'url':'https://github.com/','image':'http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg', 'type':1},
    {'url':'https://www.baidu.com/','image':'http://img18.3lian.com/d/file/201709/21/f498e01633b5b704ebfe0385f52bad20.jpg', 'type':1},
    {'url':'https://www.google.com.sg/','image':'http://pic1.16pic.com/00/10/09/16pic_1009413_b.jpg', 'type':1}];

export const INITIAL_STATE = Immutable({
    refreshing: null,
    loading: null,
    failure: null,
    error: null,
    bannerList,
});

/* ------------- Selectors ------------- */

export const GithubSelectors = {
    selectBannerList: state => state.found.bannerList
};

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = (state, { data }) =>{
    console.log('================data====================');
    console.log(data);
    console.log('================data====================');
    return state.merge({ refreshing: true, data, payload: null });
};

// successful avatar lookup
export const success = (state, action) => {
    const { payload } = action;
    return state.merge({ refreshing: false, loading: false, error: null, ...payload });
};

// failed to get the avatar
export const failure = (state) =>
    state.merge({ refreshing: false, loading: false,  error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_BANNER_REQUEST]: request,
    [Types.GET_BANNER_SUCCESS]: success,
    [Types.GET_BANNER_FAILURE]: failure
});
