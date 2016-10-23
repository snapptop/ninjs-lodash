/**
 * Debug Output
 */
'use strict'

const _ = require('lodash')
const jsonFile = require('./files')('json')
const jsFile = require('./files')('js')

exports = module.exports = {
  "log": log,
  "jsonlog": jsonlog,
  "jslog": jslog
}

_.mixin(exports)

function log() { return console.log.apply(console, _.toArray(arguments)) }
function jsonlog(val, opts) { return console.log(jsonFile.toString(val, opts)) }
function jslog(val, opts) { return console.log(jsFile.toPretty(val, opts)) }