

export const layer2 = '';

// const addressHex = "\(address.description.lowercased())"
// const rpcURL = "\(config.rpcURL.absoluteString)"
// const chainID = "\(config.chainID)"

export const signer = `
const addressHex = '0xb5538753F2641A83409D2786790b42aC857C5340';
const rpcURL = 'ws://rinkeby03.milewan.com:8546';
const chainID = '4';

function executeCallback (id, error, value) {
    AlphaWallet.executeCallback(id, error, value);
}

AlphaWallet.init(rpcURL, {
    getAccounts (cb) { cb(null, [addressHex]); },
    processTransaction (tx, cb){
        console.log('signing a transaction', tx);
        const { id = 8888 } = tx;
        AlphaWallet.addCallback(id, cb);
        webkit.messageHandlers.signTransaction.postMessage({'name': 'signTransaction', 'object': tx, id});
    },
    signMessage (msgParams, cb) {
        const { data } = msgParams;
        const { id = 8888 } = msgParams;
        console.log('signing a message', msgParams);
        AlphaWallet.addCallback(id, cb);
        webkit.messageHandlers.signMessage.postMessage({'name': 'signMessage', 'object': { data }, id});
    },
    signPersonalMessage (msgParams, cb) {
        const { data } = msgParams;
        const { id = 8888 } = msgParams;
        console.log('signing a personal message', msgParams);
        AlphaWallet.addCallback(id, cb);
        webkit.messageHandlers.signPersonalMessage.postMessage({'name': 'signPersonalMessage', 'object': { data }, id});
    },
    signTypedMessage (msgParams, cb) {
        const { data } = msgParams;
        const { id = 8888 } = msgParams;
        console.log('signing a typed message', msgParams);
        AlphaWallet.addCallback(id, cb);
        webkit.messageHandlers.signTypedMessage.postMessage({'name': 'signTypedMessage', 'object': { data }, id});
    }
}, {
    address: addressHex,
    networkVersion: chainID
});

web3.setProvider = function () {
    console.debug('AlphaWallet Wallet - overrode web3.setProvider');
};

web3.eth.defaultAccount = addressHex;

web3.version.getNetwork = function(cb) {
    cb(null, chainID);
};

web3.eth.getCoinbase = function(cb) {
    return cb(null, addressHex);
};
`;




