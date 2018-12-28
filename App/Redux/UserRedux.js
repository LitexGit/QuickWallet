import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    saveUserInfo: ['data'],

    registerRequest: ['data'],
    registerSuccess: ['data'],
    registerFailure: null,

    getUserInfoRequest: ['data'],
    getUserInfoSuccess: ['data'],
    getUserInfoFailure: null,
    logout:['data'],
});

export const UserTypes = Types;
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

    uid:0,
    nickname:'',
    sharecode:'',
    created_at:'',
    last_login:'',

    isLoginInfo:false,
    isAgreeInfo:false,
});

/* ------------- Selectors ------------- */

export const UserSelectors = {
    selectNickname: state => state.user.nickname,
    selectSharecode: state => state.user.sharecode,
};

/* ------------- Reducers ------------- */

export const saveUserInfo = (state, { data }) =>state.merge(data);


// request the avatar for a user
export const request = (state, { data }) =>
    state.merge({ refreshing: true, data, payload: null })
;

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
    [Types.REGISTER_SUCCESS]: success,
    [Types.REGISTER_FAILURE]: failure,

    [Types.GET_USER_INFO_SUCCESS]: success,
    [Types.GET_USER_INFO_FAILURE]: failure,

    [Types.SAVE_USER_INFO]: saveUserInfo,
});
