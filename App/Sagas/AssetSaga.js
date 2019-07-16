import { call, put, select, all } from 'redux-saga/effects';
import Config from 'react-native-config';
import AssetActions from '../Redux/AssetRedux';
import { UserSelectors } from '../Redux/UserRedux';
import { AssetSelectors } from '../Redux/AssetRedux';
import Toast from 'react-native-root-toast';
import { DeviceStorage, Keys } from '../Lib/DeviceStorage';
import { CurrencyConfig } from '../Config/MineConfig';
import I18n from '../I18n';
import { EventEmitter, EventKeys } from '../Lib/EventEmitter';


import Moment from 'moment';
Moment.locale('zh-cn');

const apiKey = Config.ETHERSCAN_API_KEY;
const environment = 'rinkeby';
const timeout = 10000;

export function* updateBalance() {
  console.log('======updateBalance======updateBalance======updateBalance==================');
  try {
    const tokens = yield select(AssetSelectors.tokens);

    for (const token of tokens) {
      const { Symbol: symbol, Tokenaddress: tokenAddress } = token;
      const address = yield select(UserSelectors.getAddress);
      if (symbol === 'ETH') {
        yield put(AssetActions.getBalanceRequest({ address }));
      } else {
        // address, tokenname, contractaddress
        const api = require('etherscan-api').init(apiKey, environment, timeout);
        const response = yield call(api.account.tokenbalance, address, '', tokenAddress);
        const { status, result } = response;
        if (status) {
          yield put(AssetActions.getTokenBalanceSuccess({
            symbol,
            banance: result
          }));
        } else {
          yield put(AssetActions.getTokenBalanceFailure());
        }
      }
    }
  } catch (error) {
    console.log('updateBalance==>'+error);
  }
}

export function* getTokenList(api) {
  try {
    const response = yield call(api.getTokenList);
    const { data: result } = response;
    const { data, status, msg } = result;
    if (status) {
      // const lxt = { Id: 2, Decimal: 18, Sort: 2, Status: 1, Symbol: 'LXT', Tokenaddress: '0x641f543E76cD0Dfe81717d91Ab532831468FA3CE', Rate: '0.18' }
      const { tokenList } = data;
      // tokenList.push(lxt)

      const currency = (yield DeviceStorage.getItem(Keys.MONETARY_UNIT)) || CurrencyConfig.CNY;
      const { key = 'CNY' } = currency;
      let ethRate = undefined
      const tokenArray = tokenList.map((token) => {
        let { Rate: rate = '0.18', Symbol:symbol } = token;
        rate = JSON.parse(rate);
        if (symbol === 'ETH') {
          ethRate = rate[key];
        }
        token.Rate = rate[key];
        return token;
      });
      data.tokenList = tokenArray;
      yield put(AssetActions.update({ethRate}));
      yield put(AssetActions.getTokenListSuccess(data, ethRate));

      console.log('======getTokenList========getTokenList======================');
      yield put(AssetActions.updateBalance());
    } else {
      yield put(AssetActions.getTokenListFailure());
      Toast.show(msg, {
        shadow: true,
        position: Toast.positions.CENTER
      });
    }
  } catch (error) {
    Toast.show(error.message || error, {
      shadow: true,
      position: Toast.positions.CENTER
    });
    yield put(AssetActions.getTokenListFailure());
  }
}

export function* getTxlist(action) {
  try {
    const { data: params } = action;
    const { address, page = 1, offset = 20, symbol = 'ETH', tokenAddress = '' } = params;
    const startblock = 0;
    const endblock = 'latest';
    const sort = 'desc';
    const api = require('etherscan-api').init(apiKey, environment, timeout);

    let response = {};
    if (symbol === 'ETH') {
      response = yield call(api.account.txlist, address, startblock, endblock, page, offset, sort);
    } else {
      if (page === 1) {
        response = yield call(api.account.tokentx, address, tokenAddress, startblock, endblock, sort);
      }
    }

    const { status, message, result } = response;
    let txlist = result.map((item) => {
      const { timeStamp = '' } = item;
      const date = Moment.unix(timeStamp).format('YYYY-MM-DD');
      const time = Moment.unix(timeStamp).format('HH:mm:ss');
      return { ...item, time, date };
    });

    if (status && txlist.length) {
      if (page > 1) {
        const oldData = yield select(AssetSelectors.getTxlist);
        txlist = [...oldData, ...txlist];
      }

      yield put(AssetActions.getTxlistSuccess({ txlist }));
      return;
    }
    Toast.show(message, {
      shadow: true,
      position: Toast.positions.CENTER
    });
    yield put(AssetActions.getTxlistFailure());
  } catch (error) {
    const { data: params } = action;
    const { page = 1 } = params;
    let errMsg = I18n.t('NoRecord');
    if (page !== 1) {
      errMsg = I18n.t('NoMoewRecord');
      EventEmitter.emit(EventKeys.NO_MORE_RECORD);
    }
    Toast.show(errMsg, {
      shadow: true, position:
        Toast.positions.CENTER
    });
    yield put(AssetActions.getTxlistFailure());
  }

}

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

export function* getBalance(action) {
  try {
    const { data: params } = action;
    const { address } = params;
    const api = require('etherscan-api').init(apiKey, environment, timeout);

    // console.log('====================================');
    // api.account.balance('0x38bCc5B8b793F544d86a94bd2AE94196567b865c').then(function(balanceData){
    //   console.log('===========console.log(balanceData);=========================');
    //   console.log(balanceData);
    //   console.log('===========console.log(balanceData);=========================');
    // });
    // console.log('====================================');

    const response = yield call(api.account.balance, address);
    const { status, message, result } = response;
    if (status) {
      yield put(AssetActions.getBalanceSuccess({
        symbol: 'ETH',
        banance: result
      }));
      return;
    }
    yield put(AssetActions.getBalanceFailure(message));
  } catch (error) {
    yield put(AssetActions.getBalanceFailure());
    const errMsg = error.message || error;
    Toast.show(errMsg, {
      shadow: true,
      position: Toast.positions.CENTER
    });
  }
}


export function* getTokenBalance(action) {
  try {
    const { data: params } = action;
    const { tokenname, contractaddress, address } = params;
    const api = require('etherscan-api').init(apiKey, environment, timeout);
    const response = yield call(api.account.tokenbalance, address, '', contractaddress);
    const { status, message, result } = response;
    if (status) {
      yield put(AssetActions.getTokenBalanceSuccess({
        symbol: tokenname,
        banance: result
      }));
      return;
    }
    yield put(AssetActions.getTokenBalanceFailure(message));
  } catch (error) {
    const errMsg = error.message || error;
    Toast.show(errMsg, {
      shadow: true,
      position: Toast.positions.CENTER
    });
    yield put(AssetActions.getTokenBalanceFailure());
  }
}



