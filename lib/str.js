/**
 * String Utils / Formatting
 * ninjs.lodash.str
 */
'use strict'

const _ = require('lodash')
const numeral = require('numeral')

const REGX_APLHA_NUM = /[^a-z0-9]+/g
const REGX_DASHES = /^-|-$/g
const REGX_LINES = /\r\n|\n\r|\n|\r/g
const REGX_LINES_COMPACT = /[^\r\n]+/g
const REGX_COMMAS = /(\d+)(\d{3})/

//const REGX_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
const REGX_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg

exports = module.exports = {
  "guid": guid,
  "ns": ns,
  "prune": prune,
  "strip": strip,
  "insertString": insertString,
  "commas": commas,
  "lines": lines,
  "rawlines": rawlines,
  "bytes": bytes
}

_.mixin(exports)

// 16 character unique id
function guid() { return Math.random().toString(36).substring(2, 8) + Math.random().toString(36).substring(2, 8) }

// returns string of joined args with "."
function ns(src) { return _.join(_.compact(_.toArray(arguments)), ".") }

// trims end of string, can trimmed back to next clean word,
// or add suffix to end of trimmed string
function prune(str, max, nice, suf) {
  max = max || 140
  nice = _.isBoolean(nice) ? nice : false
  if (!str || max <= 0 || str.length <= max) return str
  suf = suf || "..."
  str = str.substr(0, max)
  return nice ? str.substr(0, Math.min(str.length, str.lastIndexOf(" "))) + suf : str
}

// returns src string stripped of any comments
function strip(src) { return src && _.isString(src) ? _.replace(src, REGX_COMMENTS, "") : src }

function lines(str) {
  if (!str || !_.isString(str)) return []
  let ret = str.match(REGX_LINES_COMPACT) || []
  ret = _.compact(_.map(ret, (line) => {
		var trimTest = _.trim(line)
    return trimTest ? line : ''
  }))
  return ret
}

function rawlines(str) {
  if (!str || !_.isString(str)) return []
  return _.replace(str, REGX_LINES, "\n").split("\n")
}

function insertString(orig, findString, str) {
  let findIndex = orig.indexOf(findString)
  if (findIndex < 0) return orig
  let afterIndex = findIndex + findString.length
  return orig.slice(0, afterIndex) + str + orig.slice(afterIndex)
}

function commas(nStr) {
  let x = (nStr || '').split('.'),
    x1 = x[0],
    x2 = x.length > 1 ? '.' + x[1] : ''
  while (REGX_COMMAS.test(x1)) x1 = _.replace(x1, REGX_COMMAS, '$1' + ',' + '$2')
  return x1 + x2
}

function slug(str) { return _.replace(_.replace(_.toLower(str), REGX_APLHA_NUM, '-'), REGX_DASHES, "") }

// bytes

// Returns formatted bytes
// http://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function bytes(bytes) {
  //if(bytes < 1024) return bytes + " Bytes"
    //else if(bytes < 1048576) return(bytes / 1024).toFixed(3) + " KB"
    //else if(bytes < 1073741824) return(bytes / 1048576).toFixed(3) + " MB"
    //else return(bytes / 1073741824).toFixed(3) + " GB"
  return bytes ? numeral(bytes).format('0.0 b') : "0"
}