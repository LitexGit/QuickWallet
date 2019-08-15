import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    getBannerRequest: ['data'],
    getBannerSuccess: ['data'],
    getBannerFailure: null,

    getAppsRequest: ['data'],
    getAppsSuccess: ['data'],
    getAppsFailure: null
});

export const FoundTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    refreshing: false,
    loading: false,
    bannerList: [],
    appList: []
});

/* ------------- Selectors ------------- */

export const GithubSelectors = {
    selectBannerList: state => state.found.bannerList
};

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = (state, action) => {
  return state.merge({ refreshing: true, error: true })
};

// successful avatar lookup
export const success = (state, { data }) => {
    return state.merge({ refreshing: false, loading: false, data });
};

// failed to get the avatar
export const failure = (state) =>
    state.merge({ refreshing: false, loading: false, payload: null });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_BANNER_REQUEST]: request,
    [Types.GET_BANNER_SUCCESS]: success,
    [Types.GET_BANNER_FAILURE]: failure,

    [Types.GET_APPS_REQUEST]: request,
    [Types.GET_APPS_SUCCESS]: success,
    [Types.GET_APPS_FAILURE]: failure
});
