import { call, put, select, all } from 'redux-saga/effects';
import Config from 'react-native-config';

import AssetActions from '../Redux/AssetRedux';

import Moment from 'moment';
import cn from 'moment/locale/zh-cn';
Moment.locale('zh-cn');

const apiKey = Config.ETHERSCAN_API_KEY;
const environment = 'rinkeby';
const timeout = 10000;

export function *getTokenList(api){
    const address = '0xb5538753F2641A83409D2786790b42aC857C5340';
    // const response = yield call(api.getTokenList);
    // const {status, data} = response;

    const data = {'tokenList':[
        {
            'img_url':'http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg',
            'tokenAddress':'0x6d0e04bd467347d6eac8f9b02cc86b8ddb0d8c11',
            'symbol':'ETH',
            'decimal':'18',
            'supply':'',
            'count':0,
            'value':0,

        },{
            'img_url':'http://img3.imgtn.bdimg.com/it/u=3142207919,2669735180&fm=200&gp=0.jpg',
            'tokenAddress':'0x6d0e04bd467347d6eac8f9b02cc86b8ddb0d8c11',
            'symbol':'LXT',
            'decimal':'18',
            'supply':'',
            'count':0,
            'value':0,
        }
    ]};

    const {tokenList} = data;

    for (const token of tokenList) {
        const {symbol, tokenAddress} = token;
        if (symbol === 'ETH') {
            yield put(AssetActions.getBalanceRequest({address}));
        } else {
            yield put(AssetActions.getTokenBalanceRequest({address, tokenname:symbol, contractaddress:tokenAddress}));
        }
    }

    // if (status) {
    yield put(AssetActions.getTokenListSuccess(data));
    //     return;
    // }
    // yield put(AssetActions.getTokenListFailure());
}

export function * getBalance (action) {
    try {
        const {data:params} = action;
        const {address} = params;
        const api = require('etherscan-api').init(apiKey, environment, timeout);

        const response =yield call(api.account.balance,address);
        const {status, message, result} = response;
        if (status) {
            yield put(AssetActions.getBalanceSuccess({
                symbol:'ETH',
                banance:result,
            }));
            return;
        }
        yield put(AssetActions.getBalanceFailure(message));
    } catch (error) {
        console.log('==============error======================');
        console.log();
        console.log('==============error======================');
    }
}


export function * getTokenBalance(action) {
    try {
        const {data:params} = action;
        const {address, tokenname, contractaddress} = params;

        const api = require('etherscan-api').init(apiKey, environment, timeout);
        const response =yield call(api.account.tokenbalance, address, '', contractaddress );
        const {status, message, result} = response;
        if (status) {
            yield put(AssetActions.getTokenBalanceSuccess({
                symbol:tokenname,
                banance:result,
            }));
            return;
        }
        yield put(AssetActions.getTokenBalanceFailure(message));
    } catch (error) {
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }
}

export function * getTxlist (action) {
    try {
        const {data:params} = action;
        const {address, page=1, offset=20, symbol='ETH', tokenAddress=''} = params;
        console.log('============address========================');
        console.log(address);
        console.log('============address========================');
        const startblock = 0;
        const endblock='999999999';
        const sort='desc';
        const api = require('etherscan-api').init(apiKey, environment, timeout);

        let response = {};
        if (symbol === 'ETH') {
            response = yield call(api.account.txlist,address, startblock, endblock, page, offset, sort);
        } else {
            response = yield call(api.account.tokentx, address, tokenAddress, startblock, endblock, page, offset, sort);
        }

        const {status, message, result} = response;
        const txlist = result.map((item) => {
            const {timeStamp=''} = item;
            const date = Moment.unix(timeStamp).format('YYYY-MM-DD');
            const time = Moment.unix(timeStamp).format('HH:mm:ss');
            return {...item, time, date};
        });
        if (status) {
            yield put(AssetActions.getTxlistSuccess({txlist}));
            return;
        }
        yield put(AssetActions.getTxlistFailure(message));
    } catch (error) {
        console.log('==============error======================');
        console.log(error);
        console.log('==============error======================');
    }

}








// {
//   "message": "OK",
//   "result": [
//       {
//         blockHash: "0x5fc3b97c12c741a92581a7b8a7460d9869b37eb8056e4c9f421d3b981bc7d182"
//         blockNumber: "3502879"
//         confirmations: "52520"
//         contractAddress: ""
//         cumulativeGasUsed: "57161"
//         from: "0xb5538753f2641a83409d2786790b42ac857c5340"
//         gas: "51000"
//         gasPrice: "10000000000"
//         gasUsed: "21000"
//         hash: "0x686f625c7a71511327ff27f8c42b68cf00c1fbb1dd91a0cb79986e0f9473cc47"
//         input: "0x"
//         isError: "0"
//         nonce: "141"
//         timeStamp: "1544671886"
//         to: "0x38bcc5b8b793f544d86a94bd2ae94196567b865c"
//         transactionIndex: "1"
//         txreceipt_status: "1"
//         value: "1"
//       },
//   ],
//   "status": "1"
// }

// {
//   "message": "OK",
//   "result": [
//       {
//         blockHash: "0xdbb525db245298040f481405f4b64fdb96cbd7f55c191f51c00143cdb2b8660f"
//         blockNumber: "2883283"
//         confirmations: "672330"
//         contractAddress: "0x875664e580eea9d5313f056d0c2a43af431c660f"
//         cumulativeGasUsed: "4197945"
//         from: "0x0000000000000000000000000000000000000000"
//         gas: "5000000"
//         gasPrice: "1000000000"
//         gasUsed: "3707145"
//         hash: "0x5de187ecb8f49ee6a2760fcb9c5eac6d0df7d43ec788593250027a7b1599336a"
//         input: "0x0e6848cc0000000000000000000000000000000000000000"
//         nonce: "383"
//         timeStamp: "1535319442"
//         to: "0x4e83362442b8d1bec281594cea3050c8eb01311c"
//         tokenDecimal: "18"
//         tokenName: "TEST"
//         tokenSymbol: "TEST"
//         transactionIndex: "3"
//         value: "365000000000000000000"
//       },
//   ],
//   "status": "1"
// }

