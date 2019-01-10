
import I18n from '../I18n';
import utils from 'ethers-utils';
import Ramda from 'ramda';



function groupBy(objectArray, property) {
    return objectArray.reduce((acc, obj) => {
        const key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

export const formatDate = d => {
    let date = '';
    if(d instanceof Date) {
        date = d.toISOString().slice(0,10);
    }
    return date;
};

export const sectionlize = (items) => {
    const sections = [];
    if(Array.isArray(items) && items.length) {
        const dateGroup = groupBy(items, 'date');
        const d = new Date();
        const today = formatDate(d);
        d.setDate(d.getDate() - 1);
        const yesterday = formatDate(d);
        Object.keys(dateGroup).forEach(key=>{
            const data = dateGroup[key];
            key===today && (key=I18n.t('Today'));
            key===yesterday && (key=I18n.t('Yesterday'));
            sections.push({ key, data });
        });
    }

    return sections;
};

export const isValidMnemonic = (mnemonic) => {
    if (!mnemonic.length) return false;
    if (Ramda.split(' ')(mnemonic).length !== 12) return false;
    return true;
};

export const getWei = (value, unitType) => utils.parseUnits(value, unitType).toString();

export const getToken = (value, unitType) => {
    const amount = utils.formatUnits(value, unitType);
    const num = parseFloat(amount);
    const result = num.toFixed(4);
    return result;
};

export const getValue = (count, rate, fixed=2) => {
    if (!count || !rate) return '0.00';
    const value = count * rate;
    const result = value.toFixed(fixed);
    return result;
};

export function toFixed(value, fixed=2) {
    if (!value) return '0.00';
    const result = value.toFixed(fixed);
    return result;
}

export function getDisplayTxInfo(signInfo) {
    let {data='', gas='', gasPrice='', value=''} = signInfo;
    gas = parseInt(gas, 16).toString();
    gasPrice = parseInt(gasPrice, 16).toString();
    value = parseInt(value, 16).toString();
    const info = {...signInfo, gas, gasPrice, value};
    return info;
}















