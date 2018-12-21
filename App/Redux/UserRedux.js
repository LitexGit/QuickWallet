import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    registerRequest: ['data'],
    registerSuccess: ['data'],
    registerFailure: null,

    getUserInfoRequest: ['data'],
    getUserInfoSuccess: ['data'],
    getUserInfoFailure: null,
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
    nickname:'我怎这么好看',
    sharecode:'SHARECODE',
    created_at:'1',
    last_login:'2018:12:21'
});

/* ------------- Selectors ------------- */

export const UserSelectors = {
    selectNickname: state => state.user.nickname,
    selectSharecode: state => state.user.sharecode,
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
    [Types.REGISTER_REQUEST]: request,
    [Types.REGISTER_SUCCESS]: success,
    [Types.REGISTER_FAILURE]: failure,

    [Types.GET_USER_INFO_REQUEST]: request,
    [Types.GET_USER_INFO_SUCCESS]: success,
    [Types.GET_USER_INFO_FAILURE]: failure
});
