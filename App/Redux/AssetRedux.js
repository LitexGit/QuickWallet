import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { getToken } from '../Lib/Format';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    setSelectedToken:['data'],

    getTokenListRequest: ['data'],
    getTokenListSuccess: ['data'],
    getTokenListFailure: null,

    getTokenBalanceRequest: ['data'],
    getTokenBalanceSuccess: ['data'],
    getTokenBalanceFailure: null,

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
    refreshing: false,
    loading: false,
    failure: false,
    error: false,

    tokenList:[],
    selectedToken:{},

    balances:[],
    txlist:[],
    ethBanance:'',
});

/* ------------- Selectors ------------- */
export const AssetSelectors = {
    getBalances: state => state.assets.balances,
    getTxlist: state => state.assets.txlist,
};

/* ------------- Reducers ------------- */
export const getBalanceSuccess = (state, { data }) =>{
    const {tokenList} = state;
    const {symbol:ETH, banance} = data;
    const list = tokenList.map((token)=>{
        const {Symbol:symbol, Decimal:decimal = 18} = token; // token
        if (symbol !== ETH) {
            return token;
        }
        const count = getToken(banance, decimal);
        return token.merge({count});
    });
    return state.merge({tokenList:list});
};

export const getBalanceFailure = (state, { data }) => state;

export const getTokenBalanceSuccess = (state, { data }) =>{
    const {tokenList} = state;
    const {symbol:tokenname, banance} = data;
    const list = tokenList.map((token)=>{
        const {Symbol:symbol, Decimal:decimal = 18} = token; // token
        if (symbol !== tokenname) {
            return token;
        }
        const count = getToken(banance, decimal);
        return token.merge({count});
    });
    return state.merge({tokenList:list});
};


export const getTokenBalanceFailure = (state, { data }) => state;

// const test = {selectedToken:{
//     Symbol: 'ETH',
//     Tokenaddress: '0x6d0e04bd467347d6eac8f9b02cc86b8ddb0d8c11',
//     count: 30,
//     Decimal: 18
// }};
export const setSelectedToken = (state, { data }) =>state.merge({...data});

export const request = (state, action) =>{
    const {type, data} = action;
    if (type === 'GET_TXLIST_REQUEST') {
        const {page = 1} = data;
        if (page === 1) {
            return state.merge({refreshing: true, loading: false, error: false});
        }
        return state.merge({refreshing: false, loading: true, error: false});
    }
    return state.merge({ refreshing: true, loading: false, error: false });
};

export const success = (state, { data }) =>
    state.merge({ refreshing: false, loading: false, error: false, ...data });


export const failure = (state) =>
    state.merge({ refreshing: false, loading: false,  error: true });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.SET_SELECTED_TOKEN]: setSelectedToken,

    [Types.GET_TOKEN_LIST_REQUEST]: request,
    [Types.GET_TOKEN_LIST_SUCCESS]: success,
    [Types.GET_TOKEN_LIST_FAILURE]: failure,

    [Types.GET_TOKEN_BALANCE_SUCCESS]: getTokenBalanceSuccess,
    [Types.GET_TOKEN_BALANCE_FAILURE]: getTokenBalanceFailure,

    [Types.GET_BALANCE_REQUEST]: request,
    [Types.GET_BALANCE_SUCCESS]: getBalanceSuccess,
    [Types.GET_BALANCE_FAILURE]: getBalanceFailure,

    [Types.GET_TXLIST_REQUEST]: request,
    [Types.GET_TXLIST_SUCCESS]: success,
    [Types.GET_TXLIST_FAILURE]: failure
});
