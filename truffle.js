require('dotenv').config();
function configure(environment) {

    if (process.argv[2] === 'test' || environment === 'testRpc') {

        process.env.NODE_ENV = 'test';

        return {
            host: "localhost",
            port: 8545,
            network_id: "*"

        }
    }

    if (process.argv[2] === 'deploy' || process.argv[2] === 'migrate') {

        process.env.NODE_ENV = environment;

        const Web3 = require('web3');

        const web3HttpProvider = process.env.PROVIDER_URL;
        const web3HttpProviderToken = process.env.PROVIDER_TOKEN;

        const ethereumjsWallet = require('ethereumjs-wallet');
        const WalletSubprovider = require('web3-provider-engine/subproviders/wallet.js');
        const Web3Subprovider = require("web3-provider-engine/subproviders/web3.js");
        const FilterSubprovider = require('web3-provider-engine/subproviders/filters.js');
        const ProviderEngine = require("web3-provider-engine");

        const walletKey = process.env.WALLET_KEY;
        const wallet = ethereumjsWallet.fromPrivateKey(new Buffer(walletKey, 'hex'));
        const walletAddress = '0x'.concat(wallet.getAddress().toString('hex'));

        engine = new ProviderEngine();

        engine.addProvider(new FilterSubprovider());
        engine.addProvider(new WalletSubprovider(wallet, {}));
        engine.addProvider(new Web3Subprovider(new Web3.providers.HttpProvider(web3HttpProvider + web3HttpProviderToken)));

        engine.start();

        return {
            provider: engine,
            from: walletAddress,
            network_id: "*",
        };
    }

    return {};
}

module.exports = {
    networks: {

        testRpc: configure('testRpc'),
        development: configure('development'),
        production: configure('production')
    }
};


