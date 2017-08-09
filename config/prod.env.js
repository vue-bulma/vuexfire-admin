'use strict'

const merge = require('webpack-merge')
const firebaseEnv = require('./firebase.env')

module.exports = merge(firebaseEnv, {
  NODE_ENV: '"production"'
})
