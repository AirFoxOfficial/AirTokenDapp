import {padRight} from './pad';
import BigNumber from 'bignumber.js';

const TOKEN_DECIMALS = process.env.TOKEN_DECIMALS || 8;
const times = padRight('1', parseInt(TOKEN_DECIMALS)+1);

function convertTo(value) {
    return new BigNumber(value.toString(10), 10).times(times);
}

function convertFrom(value) {
	return new BigNumber(value).dividedBy(times);
}

export {convertTo, convertFrom}
