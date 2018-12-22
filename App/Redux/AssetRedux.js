import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    getBalanceRequest: ['data'],
    getBalanceSuccess: ['data'],
    getBalanceFailure: null,

    getTxlistRequest: ['data'],
    getTxlistSuccess: ['data'],
    getTxlistFailure: null,
});

export const AssetTypes = Types;
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

    balances:[],
    txlist:[],
});

/* ------------- Selectors ------------- */

export const ConfigSelectors = {
    selectBalances: state => state.asset.balances,
    selectTxlist: state => state.asset.txlist,
};

/* ------------- Reducers ------------- */

// request the avatar for a user
export const request = (state, { data }) =>
    // console.log('================data====================');
    // console.log(data);
    // console.log('================data====================');
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
    [Types.GET_BALANCE_REQUEST]: request,
    [Types.GET_BALANCE_SUCCESS]: success,
    [Types.GET_BALANCE_FAILURE]: failure,

    [Types.GET_TXLIST_REQUEST]: request,
    [Types.GET_TXLIST_SUCCESS]: success,
    [Types.GET_TXLIST_FAILURE]: failure
});
