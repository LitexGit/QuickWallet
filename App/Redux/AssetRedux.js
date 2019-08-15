import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { getToken } from '../Lib/Format';

/* ------------- Types and Action Creators ------------- */
// API request[action] => success[action] => faile[action]

const { Types, Creators } = createActions({
    update: ['data'],

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

    updateBalance: null
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
    ethRate: ''
});

/* ------------- Selectors ------------- */
export const AssetSelectors = {
    getBalances: state => state.assets.balances,
    getTxlist: state => state.assets.txlist,
    tokens: state => state.assets.tokenList
};

/* ------------- Reducers ------------- */

export const update = (state, {data}) =>{
  return state.merge(data);
}

export const request = (state, action) =>{
  const {type, data} = action;
  if (type === 'GET_TXLIST_REQUEST') {
      const {page = 1} = data;
      if (page === 1) {
          return state.merge({refreshing: true, loading: true, txlist:[]});
      }
      return state.merge({refreshing: true, loading: true });
  }
  return state.merge({ refreshing: true, loading: true });
};

export const getBalanceSuccess = (state, { data }) =>{
    const {tokenList} = state;
    const {symbol:ETH, banance} = data;
    const list = tokenList.map((token)=>{
        const {Symbol:symbol, Decimal:decimal = 18} = token;
        if (symbol !== ETH) {
            return token;
        }
        const count = getToken(banance, decimal);
        return token.merge({count});
    });
    return state.merge({tokenList:list});
};

export const getTokenBalanceSuccess = (state, { data }) =>{
    const {tokenList} = state;
    const {symbol:tokenname, banance} = data;
    const list = tokenList.map((token)=>{
        const {Symbol:symbol, Decimal:decimal = 18} = token;
        if (symbol !== tokenname) {
            return token;
        }
        const count = getToken(banance, decimal);
        return token.merge({count});
    });
    return state.merge({tokenList:list});
};

export const success = (state, { data }) => state.merge({ refreshing: false, loading: false, ...data });

export const failure = (state) => state.merge({ refreshing: false, loading: false });

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
    [Types.UPDATE]: update,

    [Types.GET_TOKEN_LIST_REQUEST]: request,
    [Types.GET_TOKEN_LIST_SUCCESS]: success,
    [Types.GET_TOKEN_LIST_FAILURE]: failure,

    [Types.GET_TOKEN_BALANCE_SUCCESS]: getTokenBalanceSuccess,
    [Types.GET_TOKEN_BALANCE_FAILURE]: failure,

    [Types.GET_BALANCE_SUCCESS]: getBalanceSuccess,
    [Types.GET_BALANCE_FAILURE]: failure,

    [Types.GET_TXLIST_REQUEST]: request,
    [Types.GET_TXLIST_SUCCESS]: success,
    [Types.GET_TXLIST_FAILURE]: failure
});
