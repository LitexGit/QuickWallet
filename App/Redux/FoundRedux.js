import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    getBannerRequest: ['data'],
    getBannerSuccess: ['data'],
    getBannerFailure: null,

    getAppsRequest: ['data'],
    getAppsSuccess: ['data'],
    getAppsFailure: null,
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

const bannerList = [];
const appList = [];

export const INITIAL_STATE = Immutable({
    refreshing: null,
    loading: null,
    failure: null,
    error: null,
    bannerList,
    appList
});

/* ------------- Selectors ------------- */

export const GithubSelectors = {
    selectBannerList: state => state.found.bannerList
};

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = (state, { data }) =>
    state.merge({ refreshing: true, data, payload: null })
;

// successful avatar lookup
export const success = (state, action) => {
    const { data } = action;
    return state.merge({ refreshing: false, loading: false, error: null, ...data });
};

// failed to get the avatar
export const failure = (state) =>
    state.merge({ refreshing: false, loading: false,  error: true, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_BANNER_REQUEST]: request,
    [Types.GET_BANNER_SUCCESS]: success,
    [Types.GET_BANNER_FAILURE]: failure,

    [Types.GET_APPS_REQUEST]: request,
    [Types.GET_APPS_SUCCESS]: success,
    [Types.GET_APPS_FAILURE]: failure
});
