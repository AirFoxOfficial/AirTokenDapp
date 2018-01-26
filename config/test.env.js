'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"test"',
  CONTROLLER_ADDRESS: '""',
  TOKEN_ADDRESS: '""',
  LEDGER_ADDRESS: '""',
  MDN_ADDRESS: '""',
  ACCOUNT_SERVICE_BASE_URL: "''",
  WALLET_SERVICE_BASE_URL: "''"
})
