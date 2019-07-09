import * as utils from 'web3-utils'

export const getWei = (value, unitType) => {
  if (!value || isNaN(value)) return '0';
  return utils.parseUnits(value, unitType).toString();
};

 /**
 * wei to decimal
 * @param {*} x     wei
 * @param {*} n     decimal
 * @param {*} fixed .
 */
export function weiToDecimal (x, n, fixed) {
  const BN = require('bn.js')
  const base = new BN(10).pow(new BN(n))
  const dm = new BN(x).divmod(base)

  if (dm.mod.lte(new BN(0))) {
    dm.mod = dm.mod.mul(new BN(-1))
  }
  let decimal = dm.mod.toString(10, n)
  if (decimal.length <= fixed) {
    decimal = utils.padRight(decimal, fixed)
  } else {
    decimal = decimal.substring(0, fixed)
  }

  // const str = dm.div + '.' + dm.mod.toString(10, n);
  let str = ''
  if (fixed > 0) {
    str = dm.div.toString() + '.' + decimal
  } else {
    str = dm.div.toString()
  }
  return str
}

/**
 * wei to decimal
 * @param {*} amount     wei
 * @param {*} decimal    decimal
 * @param {*} pos        .
 */
export function toDecimal ({ amount, decimal = 18, pos = 4 }) {
  return weiToDecimal(amount, decimal, pos)
}


