'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  CONTROLLER_ADDRESS: '""',
  TOKEN_ADDRESS: '""',
  LEDGER_ADDRESS: '""',
  MDN_ADDRESS: '""',
  ACCOUNT_SERVICE_BASE_URL: "'http://localhost:3000/api/v1'",
  WALLET_SERVICE_BASE_URL: "'http://localhost:4000/api/v1'",
  FIREBASE_API_KEY: '"AIzaSyAPKj-EesLjSbgibPqoHc0goo7PD-Ao-LY"',
  FIREBASE_AUTH_DOMAIN: '"airfox-demo-apps.firebaseapp.com"',
  FIREBASE_DB_URL: '"https://airfox-demo-apps.firebaseapp.com"',
  DEVICE_ID: '"dappv1"'
})
