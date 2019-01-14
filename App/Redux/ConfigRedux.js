import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    getConfigRequest: ['data'],
    getConfigSuccess: ['data'],
    getConfigFailure: null,
});

export const ConfigTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */
/**
 * user
 *
 * uid      用户ID
 * nickname 用户名称
 * type     用户邀请码
 */
export const INITIAL_STATE = Immutable({
    refreshing: null,
    loading: null,
    failure: null,
    error: null,
    baseUrl:'http://wallet.milewan.com:8088'
});

/* ------------- Selectors ------------- */

export const ConfigSelectors = {
    baseUrl: state => state.user.baseUrl,
};

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = (state, action) =>
    state.merge({ refreshing: true, })
;

// successful avatar lookup
export const success = (state, action) => {
    const { data } = action;
    return state.merge({ refreshing: false, loading: false, error: null, ...data });
};

// failed to get the avatar
export const failure = (state) =>
    state.merge({ refreshing: false, loading: false,  error: true});

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.GET_CONFIG_REQUEST]: request,
    [Types.GET_CONFIG_SUCCESS]: success,
    [Types.GET_CONFIG_FAILURE]: failure
});
