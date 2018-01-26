<template>
    <div>
        <h3>Transfer AIR</h3>
        <div>
            <form class="transfer">
                <div class="form-group">
                    <label for="transfer_from">From</label>
                    <p>{{ ethAccount }}</p>
                </div>
                <div class="form-group">
                    <label for="">To</label>
                    <br>
                    <input type="radio" id="two" value="ADDRESS" v-model="transfer_type">
                    <label for="two">Address</label>
                    <input type="radio" id="one" value="MDN" v-model="transfer_type">
                    <label for="one">MDN</label>
                    <br>
                    <div v-if="transfer_type == 'ADDRESS'">
                        <input class="form-control" type="text" v-model="to" placeholder="0x0000000000000000000000000000000000000000" max-length="42" key="transfer-to-address" />
                    </div>
                    <div v-if="transfer_type == 'MDN'">
                        <p>
                            Allowed transfer amount: {{allowedTransferAmount}} AIR
                        </p>
                        <input class="form-control" v-bind:class="{ 'mdn-not-found': mdn_exists===false }" type="text" v-model="to" placeholder="+00(000)000-000-000" @change="checkMdnExists" max-length="30" key="transfer-to-mdn" />
                        <span class="validation-error" v-if="mdn_exists===false">MDN not found in our database</span>
                        <span class="validation-ok" v-if="mdn_exists===true">MDN found in our database</span>
                    </div>
                </div>
                <div class="form-group" v-if="!!transfer_type">
                    <label for="amount">Amount</label>
                    <input id="amount" class="form-control" type="number" v-model="amount" />
                </div>
                <div class="form-group" v-if="!!transfer_type">
                    <label for="gas_price">Gas price</label>
                    <input id="gas_price" class="form-control" type="number" v-model="gas_price" />
                </div>
                <button type="button" class="btn btn-info" @click="callTransfer()" v-if="!!transfer_type">Transfer</button>
            </form>
            <div v-if="txHashExists">
                <transaction-details :hash="txHash" :to="to"></transaction-details>
            </div>
        </div>
    </div>
</template>

<script>
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;
const MDN_ADDRESS = process.env.MDN_ADDRESS;
const LEDGER_ADDRESS = process.env.LEDGER_ADDRESS;

import moment from 'moment';
import ethUtil from 'ethereumjs-util';
import BigNumber from 'bignumber.js';
import {errorHandler} from '../utils/handler';
import {doTransfer, doMdnTransfer, getGasPrice, getTransactionReceipt, getBalance,getAllowedTransferAmount} from '../services/ledger-api';
import {decodeJwt} from '../utils/decoder';
import {getUserByMdn,getCurrentWallet,stopPolling} from '../services/ums';
import {getUserTransferLimit} from '../services/wallet';
import TransactionDetails from '@/components/TransactionDetails';

export default {
    name: 'Transfer',
    components: {
        'transaction-details': TransactionDetails
    },
    data () {
        return {
            to: '',
            amount: 0,
            txHash: '',
            gas_price: 0,
            ethwallet: '',
            transfer_type: '',
            mdn_exists: null,
            allowedTransferAmount: ''
        }
    },
    methods: {
        callTransfer () {
            const itself = this;

            if (isNaN(itself.amount) || itself.amount == 0) {
                return errorHandler({
                    message: `Amount value is not valid.`,
                    level: 'error',
                    emitLoading: false
                });
            }
            const amount = new BigNumber(itself.amount);

            getBalance()
                .then((bal) => {
                    if (bal.toNumber() < amount.toNumber()) {
                        throw new Error('No enough AIR funds.');
                    } else {
                        // const since = moment().subtract(10, 'months').format('YYYY-MM-DD');
                        // const until = moment().format('YYYY-MM-DD');
                        // return getUserTransferLimit({ startDate: since, endDate: until, amount: amount.toNumber() });
                        const input = {
                            to: itself.to,
                            amount: itself.amount,
                            gasPrice: itself.gas_price
                        };
                        return ethUtil.isValidAddress(itself.to) ? doTransfer(input) : doMdnTransfer(input);
                    }
                }, (err) => {
                    throw err;
                })
                // .then(result => {
                //     const reachedLimit = result.data.data.reached_limit;
                //     const periodAmount = result.data.data.period_amount + amount.toNumber();
                //     if (reachedLimit === false) {
                //         itself.showing = 'information';
                //         emitLoading(true);
                //         const input = {
                //             to: itself.to,
                //             amount: itself.amount,
                //             gasPrice: itself.gas_price
                //         };
                //         return ethUtil.isValidAddress(itself.to) ? doTransfer(input) : doMdnTransfer(input);
                //     } else {
                //         throw new Error(`Maximum amount per month (10.000,00 USD). Period amount + amount=${periodAmount}. Please, contact us.`);
                //     }
                // }, (err) => {
                //     throw err;
                // })
                .then(function(txHash) {
                    itself.txHash = txHash;
                    emitLoading(false);
                }, function(err) {
                    throw err;
                })
                .catch((e) => {
                    errorHandler({
                        message: `Error while doing transfer: ${e.message}`,
                        level: 'error',
                        emitLoading: false
                    });
                });
        },
        checkMdnExists() {
            const itself = this;
            if (itself.to.length > 16) {
                errorHandler({
                    message: `MDN length must be less than 16`,
                    level: 'error',
                    emitLoading: false
                });
            } else {
                itself.mdn_exists = null;
                emitLoading(true);
                getUserByMdn(itself.to)
                    .then(resp => {
                        emitLoading(false);
                        itself.mdn_exists = resp.data.data;
                    })
                    .catch(e => {
                        errorHandler({
                            message: `Error while checking MDN: ${e.message}`,
                            level: 'error',
                            emitLoading: false
                        });
                    })
            }
            
        },
    },
    computed: {
        txHashExists: function() {
            return !!this.txHash;
        },
        ethAccount() {
            return getCurrentWallet();
        }
    },
    watch: {
        transfer_type: function() {
            this.to = '';
        }
    },
    created () {
        const itself = this;
        itself.gas_price = getGasPrice();
        getAllowedTransferAmount()
            .then(amount => {
                itself.allowedTransferAmount = amount.toString()
            });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
    cursor: pointer;
}

.transfer {
    width: 400px;
    height: 300px;
    margin: 1px solid black;
}

.pending {
    font-weight: bold;
    color: grey;
}

.mdn-not-found {
    border: 1px solid red !important;
}

.validation-error {
    color: red;
}
.validation-ok {
    color: green;
}
</style>
