<template>
    <div class="coin-balance">
        <h3>{{ name }} Balance</h3>
        <div class="balance">
            <p v-if="typeof allowedTransferAmount != 'undefined'">
                <span title="Adjust this amount in settings section">
                    Allowed transfer amount: {{ allowedTransferAmount }} {{ symbol }}
                </span>
            </p>
            <p>
                Balance: 
                <span>
                    {{ coinInfo }} {{ symbol }}
                    <a @click="fetchBalance()" class="refresh">
                        <img src="/static/refresh-grey.png" height="20" width="20" >
                    </a>
                </span>
            </p>
            <p>
                <button type="button" class="btn btn-info">+ ADD FUNDS</button>
            </p>
        </div>
    </div>
</template>

<script>

export default {
    name: 'CoinBalance',
    props: [
        'name',
        'symbol',
        'coinInfo',
        'parentFetchCoinInfo',
        'allowedTransferAmount'
    ],
    methods: {
        fetchBalance () {
            this.parentFetchCoinInfo();
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

div.coin-balance {
    border: 1px solid;
    margin-bottom: 10px;
    height: 326px;
    width: 496px;
    background: linear-gradient(135deg, #47BFEB 0%, #6591DE 100%);
    color: white;
    padding: 32px 40px 32px 40px;
}

h3 {
    font-size: 21px;
    font-weight: bold;
}

a {
    cursor: pointer;
}


p.button {

}


</style>
