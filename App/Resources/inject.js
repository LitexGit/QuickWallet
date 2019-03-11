
export const layer1 = `
const addressHex = '%1$s';
const rpcURL = '%2$s';
const chainID = %3$s;

window.document.addEventListener('message', function({data}){
  const params = JSON.parse(data);
  const {id, error, value} = params;
  executeCallback(id, error, value);
});

function executeCallback (id, error, value) {
    AlphaWallet.executeCallback(id, error, value);
}

AlphaWallet.init(rpcURL, {
    getAccounts (cb) { cb(null, [addressHex]); },

    processTransaction (tx, cb){
        const { id = 8888 } = tx;
        console.log('signing a transaction', tx);
        AlphaWallet.addCallback(id, cb);

        const params = {'name': 'signTransaction', 'object': tx, id};
        window.postMessage(JSON.stringify(params));
    },

    signMessage (msgParams, cb) {
        const { data } = msgParams;
        const { id = 8888 } = msgParams;
        console.log('signing a message', msgParams);
        AlphaWallet.addCallback(id, cb);

        const params = {'name': 'signMessage', 'object': { data }, id};
        window.postMessage(JSON.stringify(params));
    },

    signPersonalMessage (msgParams, cb) {

        const { data } = msgParams;
        const { id = 8888 } = msgParams;
        console.log('signing a personal message', msgParams);
        AlphaWallet.addCallback(id, cb);

        const params = {'name': 'signPersonalMessage', 'object': { data }, id};
        window.postMessage(JSON.stringify(params));
    },

    signTypedMessage (msgParams, cb) {
        const { data } = msgParams;
        const { id = 8888 } = msgParams;
        console.log('signing a typed message', msgParams);
        AlphaWallet.addCallback(id, cb);

        const params = {'name': 'signTypedMessage', 'object': { data }, id};
        window.postMessage(JSON.stringify(params));
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

export const layer2 = '';




