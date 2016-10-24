/**
 * Spreadsheet
 * .XLS
 */
'use strict'

const _ = require('lodash')
const settings = require('../settings')

exports = module.exports = {
  "fromString": fromString,
  "toString": toString
}

function fromString(val) { return val }
function toString(val) { return val }