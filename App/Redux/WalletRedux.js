import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    gethInit: null,
    gethUnInit: null,
    gethIsUnlockAccount:null,
    gethUnlockAccount:['data'],
    gethNewWallet: ['data'],
    gethRandomMnemonic:['data'],
    gethImportMnemonic: ['data'],
    gethImportPrivateKey: ['data'],
    gethExportPrivateKey: ['data'],
    gethTransfer: ['data'],

    setLoading: ['data'],
    savePrivateKey:['data'],
    saveAddress:['data'],

    gethRandomMnemonicSuccess:['data'],
    gethRandomMnemonicFailure:null,

    removeKeyStore:['data']
});

export const WalletTypes = Types;
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
    mnemonic:'',
    privateKey:'',
});

/* ------------- Selectors ------------- */
export const WalletSelectors = {
    getMnemonic: state => state.user.mnemonic,
};

/* ------------- Reducers ------------- */
export const saveAddress = (state, {data}) =>state.merge({...data});

export const savePrivateKey = (state, {data}) =>
    state.merge({...data});

export const gethRandomMnemonicSuccess = (state, {data}) =>state.merge({...data});

export const gethRandomMnemonicFailure = (state) => {
    console.log('==========gethRandomMnemonicFailure==========================');
    console.log(state);
    console.log('==========gethRandomMnemonicFailure==========================');
};

export const setLoading = (state, {data}) =>
    state.merge({...data});

// request the avatar for a user
export const request = (state, { data }) =>
    state.merge({ refreshing: true, data, payload: null });

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
    [Types.SET_LOADING]: setLoading,
    [Types.GETH_RANDOM_MNEMONIC_SUCCESS]:gethRandomMnemonicSuccess,
    [Types.SAVE_PRIVATE_KEY]:savePrivateKey,
    [Types.SAVE_ADDRESS]:saveAddress,
});
