<template>
    <div class="wallet">
        <h1>My wallet</h1>
        <h4 v-show="!!ethwallet">Current wallet: {{ ethwallet }}</h4>
        <p>Use Metamask to switch wallets</p>
        <div class="balance">
            <coin-balance
                name="Airtoken" 
                symbol="AIR" 
                :coin-info="coinInfo" 
                :allowed-transfer-amount="allowedTransfer" 
                :parent-fetch-coin-info="fetchCoinInfo"
            ></coin-balance>
            <coin-balance 
                name="Ether" 
                symbol="ETH" 
                :coin-info="ethBalance" 
                :parent-fetch-coin-info="fetchEtherBalance"
            ></coin-balance>
        </div>
    </div>
</template>

<script>
import {errorHandler} from '../utils/handler';
import {getEtherBalance, getBalance,getAllowedTransferAmount} from '../services/ledger-api';
import {getCurrentWallet,getAccessToken,stopPolling} from '../services/ums'
import CoinBalance from '@/components/CoinBalance';

export default {
    name: 'Balance',
    data () {
        return {
            coinInfo: '',
            ethBalance: '',
            allowedTransfer: '',
        }
    },
    components: {
        CoinBalance
    },
    methods: {
        fetchCoinInfo () {
            let itself = this;
            emitLoading(true);
            getBalance()
                .then(function(resp) {
                    itself.coinInfo = resp.toString();
                    emitLoading(false);
                    itself = null;
                })
                .catch(function(err) {
                    errorHandler({
                        message: `Exception trying to fetch balance: ${err.message}`,
                        level: 'error',
                        emitLoading: false
                    });
                    itself = null;
                });
        },
        fetchEtherBalance() {
            let itself = this;
            getEtherBalance()
                .then(function(balance) {
                    itself.ethBalance = balance;
                    itself = null;
                }, function(err) {
                    errorHandler({
                        message: `Exception trying to fetch ether balance: ${err.message}`,
                        level: 'error'
                    });
                    itself = null;
                });
        },
        fetchAllowedTransferAmount() {
            let itself = this;
            emitLoading(true);
            getAllowedTransferAmount()
                .then(function(resp) {
                    itself.allowedTransfer = resp.toString();
                    emitLoading(false);
                    itself = null;
                })
                .catch(function(err) {
                    errorHandler({
                        message: `Exception trying to fetch allowed balance: ${err.message}`,
                        level: 'error',
                        emitLoading: false
                    });
                    itself = null;
                });
        },
    },
    computed: {
        ethwallet() {
            return getCurrentWallet();
        }
    },
    watch: {
        ethwallet(newVal, oldVal) {
            if (newVal != oldVal) {
                this.fetchCoinInfo();
                this.fetchEtherBalance();
                this.fetchAllowedTransferAmount();
            }
        }
    },
    created() {
        this.fetchCoinInfo();
        this.fetchEtherBalance();
        this.fetchAllowedTransferAmount();
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

h4 {
    font-size: 14px;
}

</style>
