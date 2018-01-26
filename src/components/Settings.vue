<template>
    <div>
        <h1>Settings</h1>
        <h4>Here you can configure your dApp</h4>
        <div class="settings">
            <div class="form-group">
                <label for="gas_price">Gas price</label>
                <input id="gas_price" class="form-control" type="number" v-model="form.gas_price" />
            </div>
            <div class="form-group">
                <label for="approve">Approved amount (to reset you must first set it to 0)</label>
                <input id="approve" class="form-control" type="text" v-model="form.approved_amount" />
            </div>
            <button type="button" class="btn btn-info" @click="submit()">Save</button>
        </div>
        <div v-if="txHashExists">
            <transaction-details :hash="approve_hash" :to="'approve'"></transaction-details>
        </div>
    </div>
</template>

<script>
import {getGasPrice, setGasPrice,getAllowedTransferAmount,approveTransferAmount} from '../services/ledger-api';
import {errorHandler} from '../utils/handler';
import TransactionDetails from '@/components/TransactionDetails';

const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS;

export default {
    name: 'Settings',
    components: {
        TransactionDetails
    },
    data () {
        return {
            initial_approved_amount: 0,
            approve_hash: '',
            token_address: '',
            form: {
                gas_price: 0,
                approved_amount: 0
            }
        }
    },
    methods: {
        fetchGasPrice () {
            this.form.gas_price = getGasPrice();
        },
        submit () {
            const self = this;
            setGasPrice(this.form.gas_price);
            if (self.initial_approved_amount != self.form.approved_amount) {
                self.approve_hash = '';
                approveTransferAmount({ amount: self.form.approved_amount })
                    .then(result => {
                        self.approve_hash = result;
                    }, e => {
                        errorHandler({
                            message: `Error while doing transfer: ${e.message}`,
                            level: 'error',
                            emitLoading: false
                        });
                    });
                } else {
                    flash('Gas price updated', 'info');
                }
        }
    },
    created () {
        const self = this;
        self.fetchGasPrice();
        self.token_address = TOKEN_ADDRESS;
        getAllowedTransferAmount()
            .then(result => {
                self.initial_approved_amount = result.toString();
                self.form.approved_amount = result.toString();
            }, err => {
                errorHandler({
                    message: `Error while fetching approved amount: ${err.message}`,
                    level: 'error',
                    emitLoading: false
                });
            });
    },
    computed: {
        txHashExists: function() {
            return !!this.approve_hash;
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.settings {
    width: 250px;
    margin: 1px solid black;
}

</style>
