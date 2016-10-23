/**
 * Test
 */
'use strict'

const _ = require('ninjs-lodash')
const api = require('.')

const TEMP_PATH = _.path.join(__dirname, 'temp')

exports = module.exports = {
  'api.info': {
    "cmd": "node",
    "args": ['cli', 'reflect']
  }
}

runKey()

function runKey(k) {
  k = k || _.get(_.$('env.jargv'), '_[0]') || ''
  if(!k) return
  var val = _.get(exports, k)
  if(!val) return
  _.run(val, (err, result) => {
    if(err) return console.log(err)
    console.log(result)
  })
}