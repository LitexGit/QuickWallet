import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
    request: ['data'],
    success: ['data'],

    gethInit: ['data'],
    gethNewAccount: ['data'],
    gethRandomMnemonic:['data'],
    gethImportMnemonic: ['data'],
    gethImportPrivateKey: ['data'],
    gethExportPrivateKey: ['data'],
    gethTransfer: ['data'],

    setLoading: ['data'],
    gethRandomMnemonicSuccess:['data'],
    savePassphrase:['data'],
    savePrivateKey:['data'],
    saveAddress:['data'],
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
    mnemonic:'mnemonic',
    passphrase:'passphrase',
    privateKey:'privateKey',
    address:'address',
});

/* ------------- Selectors ------------- */

export const WalletSelectors = {
};

/* ------------- Reducers ------------- */
export const saveAddress = (state, {data}) =>
    state.merge({...data});

export const savePrivateKey = (state, {data}) =>
    state.merge({...data});

export const savePassphrase = (state, {data}) =>
    state.merge({...data});

export const gethRandomMnemonicSuccess = (state, {data}) =>
    state.merge({...data});

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
    [Types.SAVE_PASSPHRASE]:savePassphrase,
    [Types.SAVE_PRIVATE_KEY]:savePrivateKey,
    [Types.SAVE_ADDRESS]:saveAddress,
});
