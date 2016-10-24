/**
 * Javascript Object Notation
 * .JSON
 */
'use strict'

const _ = require('lodash')
const settings = require('../settings')
//const jsonminify = require('jsonminify')

const REGX_UTF_BOM = /^\uFEFF/
const REGX_SINGLE_QUOTE = /\'/g

function _clean(val) {
  return val && _.isString(val) ? _.replace(val, REGX_UTF_BOM, '') : val
}

exports = module.exports = {
  "fromString": fromString,
  "toString": toString,
  "minify": minify
}

function fromString(val) {
  return val ? _.isObject(val) ? val : _.isString(val) ? _.attempt(JSON.parse, _clean(val)) : val : val
}

function toString(val, opts) {
  let stringify = _.get(opts, 'stringify', settings('json.stringify'))
  let indent = _.get(opts, 'indent', settings('json.indent'))
  let res = _clean(val ? _.isString(val) ? val : _.attempt(JSON.stringify, val, stringify, indent) : val)
  //res = res.replace(REGX_SINGLE_QUOTE, '"')
  return res
}

function minify(val, opts) {
  return val
}