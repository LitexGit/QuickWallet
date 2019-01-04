import { call, put, select, all } from 'redux-saga/effects';
import Config from 'react-native-config';
import AssetActions from '../Redux/AssetRedux';
import {UserSelectors} from '../Redux/UserRedux';
import Toast from 'react-native-root-toast';
import Ramda from 'ramda';


import Moment from 'moment';
import cn from 'moment/locale/zh-cn';
Moment.locale('zh-cn');

const apiKey = Config.ETHERSCAN_API_KEY;
const environment = 'rinkeby';
const timeout = 10000;

export function *getTokenList(api){
    try {
        const response = yield call(api.getTokenList);
        const {data:result} = response;
        const {data, status, msg} = result;
        if (status) {
            const {tokenList} = data;
            yield put(AssetActions.getTokenListSuccess(data));
            for (const token of tokenList) {
                const {Symbol:symbol, Tokenaddress:tokenAddress} = token;
                const address = yield select(UserSelectors.getAddress);
                if (symbol === 'ETH') {
                    yield put(AssetActions.getBalanceRequest({address}));
                } else {
                    const api = require('etherscan-api').init(apiKey, environment, timeout);
                    const response =yield call(api.account.tokenbalance, address, '', tokenAddress);
                    const {status, message, result} = response;
                    if (status) {
                        yield put(AssetActions.getTokenBalanceSuccess({
                            symbol,
                            banance:result,
                        }));
                    } else {
                        yield put(AssetActions.getTokenBalanceFailure(message));
                    }
                }
            }
            return;
        }
        Toast.show(msg, {
            shadow:true,
            position: Toast.positions.CENTER,
        });
        yield put(AssetActions.getTokenListFailure());

    } catch (error) {
        console.log('========error============================');
        console.log(error);
        console.log('=========error===========================');

    }
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
        console.log(error);
        console.log('==============error======================');
    }
}


export function * getTokenBalance(action) {
    try {
        const {data:params} = action;
        const {tokenname,contractaddress, address} = params;
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


// const async = require('async');
// async.map(tokenList,(token, callBack) =>{
//     const {Symbol:symbol, Tokenaddress:tokenAddress} = token;
//     const address = '0xb5538753F2641A83409D2786790b42aC857C5340';
//     const apiObj = require('etherscan-api').init(apiKey, environment, timeout);
//     const result = await apiObj.account.balance(address);
// });


// const data = {'tokenList':[
//     {
//         'img_url':'http://pic28.photophoto.cn/20130809/0036036814656859_b.jpg',
//         'tokenAddress':'0x6d0e04bd467347d6eac8f9b02cc86b8ddb0d8c11',
//         'symbol':'ETH',
//         'decimal':'18',
//         'supply':'',
//         'count':0,
//         'value':0,

//     },{
//         'img_url':'http://img3.imgtn.bdimg.com/it/u=3142207919,2669735180&fm=200&gp=0.jpg',
//         'tokenAddress':'0x6d0e04bd467347d6eac8f9b02cc86b8ddb0d8c11',
//         'symbol':'LXT',
//         'decimal':'18',
//         'supply':'',
//         'count':0,
//         'value':0,
//     }
// ]};


// {
//   "message": "OK",
//   "result": [
//       {
//         blockHash: "0xc22228a8be3f4c56e0decd7a8d54f0781782048f3bb141b9142108cbfe9e090a"
//         blockNumber: "3613656"
//         confirmations: "4712"
//         contractAddress: ""
//         cumulativeGasUsed: "21000"
//         from: "0xa08105d7650fe007978a291ccfecbb321fc21ffe"
//         gas: "21000"
//         gasPrice: "20000000000"
//         gasUsed: "21000"
//         hash: "0x4ced75f1f8897ce09c032b0fe604fead89d65b39cd7927fd3b2522566ad0c53a"
//         input: "0x"
//         isError: "0"
//         nonce: "1512"
//         timeStamp: "1546333700"
//         to: "0xb5538753f2641a83409d2786790b42ac857c5340"
//         transactionIndex: "0"
//         txreceipt_status: "1"
//         value: "18571428571428571436"
//       },
//   ],
//   "status": "1"
// }

// {
//   message: "OK"
//   result: [
//     {
//       blockHash: "0x4cc6cbc946f961e4c8e9399e385249c86f76f4b14657fdf85b772a47462becae"
//       blockNumber: "3613859"
//       confirmations: "4503"
//       contractAddress: "0x6d0e04bd467347d6eac8f9b02cc86b8ddb0d8c11"
//       cumulativeGasUsed: "51932"
//       from: "0xa08105d7650fe007978a291ccfecbb321fc21ffe"
//       gas: "51932"
//       gasPrice: "11000000000"
//       gasUsed: "51932"
//       hash: "0xf3ecee11ac2d8483f859085a02b4eb74ad80b677f346916dffc6d23949c3fe0f"
//       input: "0xa9059cbb000000000000000000000000b5538753f2641a83409d2786790b42ac857c534000000000000000000000000000000000000000000000021e19e0c9bab2400000"
//       nonce: "1514"
//       timeStamp: "1546336745"
//       to: "0xb5538753f2641a83409d2786790b42ac857c5340"
//       tokenDecimal: "18"
//       tokenName: "LiteXToken"
//       tokenSymbol: "LXT"
//       transactionIndex: "0"
//       value: "10000000000000000000000"
//     }
//   ]
//   status: "1"
// }

