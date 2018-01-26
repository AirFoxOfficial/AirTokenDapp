import axios from 'axios';
import {getAccessToken} from './ums';

const WALLET_BASEURL = process.env.WALLET_SERVICE_BASE_URL;

export {
    getUserTransferLimit
};

function getUserTransferLimit(params) {
    const accessToken = getAccessToken();
    const queryString = `start_date=${params.startDate}&end_date=${params.endDate}&amount=${params.amount}`;
    return axios.get(`${WALLET_BASEURL}/transactions/sum?${queryString}`, { headers: { Authorization: accessToken } });
}
