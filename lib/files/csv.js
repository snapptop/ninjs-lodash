/**
 * Comma Separated Variables
 * .CSV
 */
'use strict'

const _ = require('lodash')

exports = module.exports = {
  "fromString": fromString,
  "toString": toString
}

function fromString(val) { return val }
function toString(val) { return val }