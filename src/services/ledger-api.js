/* eslint-disable */
import axios from 'axios';

import {httpErrorHandler} from '../utils/handler';
import {padLeft} from '../utils/pad';
import tokenAbi from '../../build/contracts/Token.json';
import {txutils, signing} from 'eth-lightwallet';
import Transaction from 'ethereumjs-tx';
import mdnAbi from '../../build/contracts/Mdn.json';
import ZeroClientProvider from 'web3-provider-engine/zero.js';
import {convertTo, convertFrom} from '../utils/decimalsConverter';
import {store} from '../store';

export {
    getEtherBalance,
    getBalance, 
    getAllowedTransferAmount, 
    approveTransferAmount, 
    doTransfer, 
    setGasPrice, 
    getGasPrice, 
    doMdnTransfer, 
    getTxDetails, 
    getTransactionReceipt, 
    watchPendingTx
}

function handleError(params) {
	throw new Error(params);
}

function getEtherBalance() {
    return new Promise((resolve, reject) => {
        web3.eth.getBalance(web3.eth.accounts[0], function(err, bal) {
            if (err) {
                return reject(err);
            } else {
                return resolve(web3.fromWei(bal.toNumber(), 'ether'));
            }
        });
    });
}

function getBalance() {
    const contract = web3.eth.contract(tokenAbi.abi).at(process.env.TOKEN_ADDRESS);
    return new Promise((resolve, reject) => {
        contract.balanceOf(web3.eth.accounts[0], function(err, bal) {
            if (err) {
                return reject(err);
            } else {
                return resolve(convertFrom(bal.toNumber()));
            }
        });
    });
}

function getAllowedTransferAmount() {
    const contract = web3.eth.contract(tokenAbi.abi).at(process.env.TOKEN_ADDRESS);
    return new Promise((resolve, reject) => {
        contract.allowance(web3.eth.accounts[0], process.env.MDN_ADDRESS, function(err, bal) {
            if (err) {
                return reject(err);
            } else {
                return resolve(convertFrom(bal.toNumber()));
            }
        });
    });
}

function approveTransferAmount(params) {
    const contract = web3.eth.contract(tokenAbi.abi).at(process.env.TOKEN_ADDRESS);
    const amountDecimals = convertTo(params.amount).toString();
    const txData = {
        from: web3.eth.accounts[0],
        to: process.env.TOKEN_ADDRESS,
        data: contract.approve.getData(process.env.MDN_ADDRESS, amountDecimals),
        gasLimit: process.env.GAS_LIMIT,
        gasPrice: params.gasPrice || store.getters.gasPrice || process.env.GAS_PRICE
    };

    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction(txData, function(err, hash) {
            if (err) {
                return reject(err);
            } else {
                return resolve(hash);
            }
        });
    });
}

function doTransfer(params) {
    const contract = web3.eth.contract(tokenAbi.abi).at(process.env.TOKEN_ADDRESS);
    const amountDecimals = convertTo(params.amount).toString();
    const txData = {
        from: web3.eth.accounts[0],
        to: process.env.TOKEN_ADDRESS,
        data: contract.transfer.getData(params.to, amountDecimals),
        gasLimit: process.env.GAS_LIMIT,
        gasPrice: params.gasPrice || store.getters.gasPrice || process.env.GAS_PRICE
    };

    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction(txData, function(err, hash) {
            if (err) {
                return reject(err);
            } else {
                return resolve(hash);
            }
        });
    });
}

function doMdnTransfer(params, callback) {
    const contract = web3.eth.contract(mdnAbi.abi).at(process.env.MDN_ADDRESS);
    const amountDecimals = convertTo(params.amount).toString();
    let paramsTo = web3.fromAscii(params.to, 32);
    const txData = {
        from: web3.eth.accounts[0],
        to: process.env.MDN_ADDRESS,
        data: contract.transferToMdn.getData(amountDecimals, paramsTo),
        gasLimit: process.env.GAS_LIMIT,
        gasPrice: params.gasPrice || store.getters.gasPrice || process.env.GAS_PRICE
    };

    return new Promise((resolve, reject) => {
        web3.eth.sendTransaction(txData, function(err, hash) {
            if (err) {
                return reject(err);
            } else {
                return resolve(hash);
            }
        })
    });
}

function setGasPrice(val) {
    if (!isNaN(val)) {
        store.commit('gasPrice', val)
        return true;
    } else {
        return false;
    }
}

function getGasPrice() {
    return store.getters.gasPrice || process.env.GAS_PRICE;
}

function getTxDetails(hash) {
    return new Promise((resolve, reject) => {
        web3.eth.getTransaction(hash, function(err, resp) {
            if (err) {
                return reject(err);
            } else {
                return resolve(resp);
            }
        });
    });
}

function getTransactionReceipt(hash) {
    return new Promise((resolve, reject) => {
        web3.eth.getTransactionReceipt(hash, function(err, resp) {
            if (err) {
                return reject(err);
            } else {
                return resolve(resp);
            }
        });
    });
}

// function watchPendingTx(boolIsAddress, params) {
function watchPendingTx(contractAddress, eventName, params) {
    let contract;

    switch(contractAddress) {
        case process.env.TOKEN_ADDRESS:
            contract = web3.eth.contract(tokenAbi.abi).at(process.env.TOKEN_ADDRESS);
            break;
        case process.env.MDN_ADDRESS:
            contract = web3.eth.contract(mdnAbi.abi).at(process.env.MDN_ADDRESS);
            break;
        default:
            throw new Error('Contract address not found.');
    }

    return contract[eventName](params);
}
