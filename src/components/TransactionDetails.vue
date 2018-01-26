<template>
    <div class="panel panel-info padded">
        <div class="panel-heading">
            <h3>
                <p>Transaction {{showing}} 
                    <span v-show="txPending" class="pending">
                        (Pending confirmation)
                        <img v-show="txPending" src="/static/EllipsisSpinner3.gif">
                    </span>
                </p>
            </h3>
        </div>
        <div class="container row" v-if="txObject && !gotTxReceipt">
            <div class="col-sm-3">TxHash:</div>
            <div class="col-sm-9">
                <router-link :to="{ name: 'TransactionDetails', params: { hash: hash }}">{{hash}}</router-link>
            </div>
            <div class="col-sm-3">Timestamp:</div>
            <div class="col-sm-9">{{ timeCounter }}</div>
            <div class="col-sm-3">From:</div>
            <div class="col-sm-9">{{ txObject.from }}</div>
            <div class="col-sm-3">To:</div>
            <div class="col-sm-9">{{ txObject.to }}</div>
            <div class="col-sm-3">Value:</div>
            <div class="col-sm-9">{{ txObject.value }}</div>
            <div class="col-sm-3">Gas limit:</div>
            <div class="col-sm-9">{{ txObject.gas }}</div>
            <div class="col-sm-3">Gas price:</div>
            <div class="col-sm-9">{{ txObject.gasPrice }}</div>
            <div class="col-sm-3">TxReceipt Status:</div>
            <div class="col-sm-9">Pending</div>
            <div class="col-sm-3">Nonce:</div>
            <div class="col-sm-9">{{ txObject.nonce }}</div>
            <div class="col-sm-3">Input data:</div>
            <div class="col-sm-9">{{ txObject.input }}</div>
        </div>
        <div class="container row" v-if="gotTxReceipt">
            <div class="col-sm-3">TxHash:</div>
            <div class="col-sm-9">
                <router-link :to="{ name: 'TransactionDetails', params: { hash: hash }}">{{hash}}</router-link>
            </div>
            <div class="col-sm-3">Block Height:</div>
            <div class="col-sm-9">{{ txReceipt.blockNumber }}</div>
            <div class="col-sm-3">Timestamp:</div>
            <div class="col-sm-9">{{ new Date() }}</div>
            <div class="col-sm-3">From:</div>
            <div class="col-sm-9">{{ txReceipt.from }}</div>
            <div class="col-sm-3">To:</div>
            <div class="col-sm-9">{{ txReceipt.to }}</div>
            <div class="col-sm-3">Value:</div>
            <div class="col-sm-9">{{ ''+txReceipt.value }}</div>
            <div class="col-sm-3">Gas limit:</div>
            <div class="col-sm-9">{{ txObject.gas }}</div>
            <div class="col-sm-3">Gas used by tx:</div>
            <div class="col-sm-9">{{ txReceipt.gasUsed }}</div>
            <div class="col-sm-3">Gas price:</div>
            <div class="col-sm-9">{{ txObject.gasPrice }}</div>
            <div class="col-sm-3">Actual Tx Cost/Fee:</div>
            <div class="col-sm-9">{{ 'TODO' }}</div>
            <div class="col-sm-3">Cumulative Gas Used:</div>
            <div class="col-sm-9">{{ txReceipt.cumulativeGasUsed }}</div>
            <div class="col-sm-3">TxReceipt Status:</div>
            <div class="col-sm-9">{{ txReceipt.status }}</div>
            <div class="col-sm-3">Nonce:</div>
            <div class="col-sm-9">{{ txObject.nonce }}</div>
            <div class="col-sm-3">Input data:</div>
            <div class="col-sm-9">{{ txObject.input }}</div>
        </div>
    </div>
</template>

<script>
import {errorHandler} from '../utils/handler';
import {getTxDetails, getTransactionReceipt, watchPendingTx} from '../services/ledger-api';
import {decodeJwt} from '../utils/decoder';
import ethUtil from 'ethereumjs-util';

const MDN_ADDRESS = process.env.MDN_ADDRESS;
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

export default {
    name: 'TransactionDetails',
    props: [
        'hash',
        'to'
    ],
    data () {
        return {
            txObject: null,
            ethEventWatcher: null,
            txPending: false,
            txReceipt: null,
            showing: 'information',
            timeCounter: 0,
        }
    },
    methods: {
        doMagic: function(txHash) {
            let itself = this;
            txHash = txHash || itself.hash;
            emitLoading(true);
            Promise.all([getTxDetails(txHash), getTransactionReceipt(txHash)])
                .then(result => {
                    return new Promise((resolve, reject) => {
                        if (result[1] != null) {
                            itself.showing = 'receipt';
                            itself.txObject = result[0];
                            itself.txReceipt = result[1];
                            throw 'flow_done';
                        } else {
                            resolve(result[0]);
                        }
                    });
                })
                .then(function(txObj) {
                    itself.txObject = txObj;
                    emitLoading(false);

                    let params, contractAddress, eventName;

                    if (txObj.to == MDN_ADDRESS) {
                        contractAddress = MDN_ADDRESS;
                        params = {
                            from: web3.eth.accounts[0],
                            to: itself.to,
                            value: txObj.value
                        };
                        eventName = 'TransferredToMdn';
                    } else {
                        contractAddress = TOKEN_ADDRESS;
                        if (itself.to === 'approve') {
                            params = {
                                owner: web3.eth.accounts[0],
                                spender: MDN_ADDRESS
                            };
                            eventName = 'Approval';
                        } else {
                            params = {
                                from: web3.eth.accounts[0],
                                to: txObj.to
                            };
                            eventName = 'Transfer';
                        }
                    }
                    return watchPendingTx(contractAddress,eventName,params);
                }, (err) => { throw err; })
                .then(watcher => {
                    itself.ethEventWatcher = watcher;
                    itself.txPending = true;
                    return new Promise((resolve) => {
                        itself.ethEventWatcher.watch(function(err, log) {
                            if (err) {
                                throw err;
                            } else {
                                itself.ethEventWatcher.stopWatching(function(err, res) {
                                    itself.txPending = false;
                                    if(err) throw err;
                                    else resolve(log);
                                });
                            }
                        });
                    });
                }, err => { throw err })
                .then((log) => {
                    itself.ethEventWatcher = null;
                    return getTransactionReceipt(txHash);
                })
                .then(receipt => {
                    itself.showing = 'receipt';
                    itself.txReceipt = receipt;

                    // return checkMdnExists();

                }, err => { throw err })
                // .then((mdnData) => {

                //     // se existe, confirmMdn
                //     // senao salvar...
                // })
                .catch((e) => {
                    if (e === 'flow_done') {
                        emitLoading(false);
                    } else {
                        errorHandler({
                            message: `Error while getting Transaction: ${e.message}`,
                            level: 'error',
                            emitLoading: false
                        });
                    }
                });
        }
    },
    computed: {
        gotTxReceipt: function() {
            return this.txReceipt != null;
        }
    },
    watch: {
        hash: function(newVal, oldVal) {
            const itself = this;
            this.txReceipt = null;
            this.showing = 'information';

            // TODO: refactor
            setTimeout(function() {
                itself.doMagic(newVal);
            }, 2000);
        },
    },
    created () {
        this.doMagic();
    },
    destroyed () {
        // if (itself.ethEventWatcher && itself.ethEventWatcher.stopWatching) {
        //     itself.ethEventWatcher.stopWatching();
        // }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    cursor: pointer;
}

.padded {
    margin-top: 50px;
    max-width: 100%;
    overflow-x: hidden;
}

.small-spinner {
    background: rgba(0,0,0,.5) url('/static/EllipsisSpinner3.gif') no-repeat center;
    float: right;
}

</style>
