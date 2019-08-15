import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    saveUserInfo: ['data'],

    registerRequest: ['data'],
    registerSuccess: ['data'],
    registerFailure: null,

    getUserInfoRequest: ['data'],
    getUserInfoSuccess: ['data'],
    getUserInfoFailure: null,

    logout:['data'],

    getInjectScript: null
});

export const UserTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
    refreshing: null,
    loading: null,
    failure: null,
    error: null,

    address:'',
    nickname:'',
    sharecode:'',

    isLoginInfo:false,
    isAgreeInfo:false,

    web3Provider:'',
    defaultRate:'',

    language:{
        key:'zh',
        title:'简体中文'
    },
    currency:{
        key:'CNY',
        title:'CNY'
    }
});

/* ------------- Selectors ------------- */

export const UserSelectors = {
    getNickname: state => state.user.nickname,
    getSharecode: state => state.user.sharecode,
    getAddress: state => state.user.address
};

/* ------------- Reducers ------------- */

export const saveUserInfo = (state, { data }) =>state.merge(data);

// request the avatar for a user
export const request = (state, action) => {
  return state.merge({ refreshing: true, error: true })
};

// successful avatar lookup
export const success = (state, action) => {
    const {type, data} = action;
    switch (type) {
    case 'REGISTER_SUCCESS':
    case 'GET_USER_INFO_SUCCESS':{
        const {Address:address, Nickname:nickname, Sharecode:sharecode} = data;
        const userInfo = {address, nickname, sharecode};
        return state.merge({ refreshing: false, loading: false, ...userInfo });
    }
    default:
        break;
    }
    return state.merge({ refreshing: false, loading: false, ...data });
};

// failed to get the avatar
export const failure = (state) => state.merge({ refreshing: false, loading: false });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.REGISTER_REQUEST]: request,
    [Types.REGISTER_SUCCESS]: success,
    [Types.REGISTER_FAILURE]: failure,

    [Types.GET_USER_INFO_REQUEST]: request,
    [Types.GET_USER_INFO_SUCCESS]: success,
    [Types.GET_USER_INFO_FAILURE]: failure,

    [Types.SAVE_USER_INFO]: saveUserInfo
});
