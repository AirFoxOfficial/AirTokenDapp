import axios from 'axios';
import {store} from '../store';

const ACCOUNT_BASEURL = process.env.ACCOUNT_SERVICE_BASE_URL;
const DEVICE_ID = process.env.DEVICE_ID;

export {
    getUserByMdn,
    doUmsLogin,
    getAccessToken,
    getUserAccountInfo,
    updateUserAccountInfo,
    getLoggedUser,
    setLoggedUser,
    removeLoggedUser,
    userKycCompleted,
    getCurrentWallet,
    setInitialAccountAndStartWatching,
    generateOtp,
    confirmOtp,
    stopPolling
};

function getUserByMdn(mdn) {
    return axios.get(`${ACCOUNT_BASEURL}/account/mdn?phone=${mdn}`);
}

function doUmsLogin(credentials) {
    return store.dispatch('umsLogin', credentials);
}

function getUserAccountInfo() {
    return store.getters.loggedUser;
}

function getAccessToken() {
    return store.getters.accessToken;
}

function updateUserAccountInfo(body) {
    return store.dispatch('updateAccountInfo', body);
}

function getLoggedUser() {
    return store.getters.loggedUser;
}

function setLoggedUser(info) {
    store.commit('login', info);
}

function removeLoggedUser() {
    store.commit('logout');
}

function userKycCompleted() {
    const loggedUser = getLoggedUser();
    
    return loggedUser.address &&
            loggedUser.firstName && 
            loggedUser.lastName && 
            loggedUser.country && 
            loggedUser.email &&
            loggedUser.phone &&
            loggedUser.user_otp &&
            loggedUser.user_otp.is_validated;
}

function getCurrentWallet() {
    return store.getters.currentWallet;
}

function setInitialAccountAndStartWatching() {
    let wallet = '';
    if (typeof web3 !== "undefined") {
        wallet = web3.eth.accounts[0];
        store.dispatch('pollAccount');
    }
    store.commit('currentWallet', wallet);
}

function generateOtp(body) {
    const accessToken = getAccessToken();
    return axios.post(`${ACCOUNT_BASEURL}/account/phone-confirmation`, body, { headers: { Authorization: accessToken } });
}

function confirmOtp(body) {
    const accessToken = getAccessToken();
    return axios.post(`${ACCOUNT_BASEURL}/account/otp-confirmation`, body, { headers: { Authorization: accessToken } });
}
