/**
 * Javascript
 * .JS
 */
'use strict'

const _ = require('lodash')
const util = require('util')
const settings = require('../settings')
const jsonFile = require('./json')

const REGX_KEY_VAL = /^"/
const REGX_KEY = /:$/
const REGX_BOOLEAN = /true|false/
const REGX_NULL = /null/
const REGX_UNDEFINED = /undefined/
const REGX_SPACES = /^\s+/

const REGX_JSON = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null|undefined)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g
//const REGX_BRACES = /[{}]/g
const REGX_BRACES = /\{([^{\}]*)\}/g
const REGX_BRACKETS = /[^\(]*(\(.*\))[^\)]*/g
const REGX_COMMAS = /\"\,/g

const REGX_ARG_NAMES = /([^\s,]+)/g
//const REGX_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg
const REGX_COMMENTS = /(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg

const REGX_REMOVE_ANSI_COLOR = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g

const DEF_CLS = settings('js.colors.cls')
const DEF_COLOR = settings('js.colors.color')

function _colorfy(str, cls) {
  cls = cls || DEF_CLS
  let setting = settings('js.colors.' + cls)
  setting = setting || DEF_COLOR
  return setting ? setting(str) : str
}

function _uncolorfy(str) {
  return str && _.isString(str) ? str.replace(REGX_REMOVE_ANSI_COLOR, '') : ''
}

function _argNames(src) {
  if(!_.isFunction(src)) return []

  let ret = _.replace(src.toString(), REGX_COMMENTS, '')
  let result = ret.slice(ret.indexOf('(') + 1, ret.indexOf(')')).match(REGX_ARG_NAMES)
  return _.isArray(result) ? result : []
}

// returns function signature name
function _sigName(src) {
  if (!_.isFunction(src)) return ''
  let ret = _.trim(_.replace(src.toString(), 'function', ''))
  ret = ret.substr(0, ret.indexOf('('))
  return ret || ''
}

module.exports = {
  "fromString": fromString,
  "toString": toString,
  "toPretty": toPretty,
  "uncolorfy": _uncolorfy
}

function fromString(val) {
  return val
}

function strwrap(item) {
  return `"${item}"`
}

function toString(val, opts) {
  return util.inspect(val, opts)
}



function toPretty(val, opts) {
  let _CACHE = []

  let wrap = _.get(opts, 'wrap', settings('js.wrap'))
  let sort = _.get(opts, 'sort', settings('js.sort'))
  let align = _.get(opts, 'align', settings('js.align'))
  let indent = _.get(opts, 'indent', settings('js.indent'))
  let decimals = _.get(opts, 'decimals', settings('js.decimals'))
  let arrayPadding = _.get(opts, 'arrayPadding', settings('js.arrayPadding'))
  let objectPadding = _.get(opts, 'objectPadding', settings('js.objectPadding'))
  let afterComma = _.get(opts, 'afterComma', settings('js.afterComma'))
  let beforeComma = _.get(opts, 'beforeComma', settings('js.beforeComma'))
  let afterColon = _.get(opts, 'afterColon', settings('js.afterColon'))
  let beforeColon = _.get(opts, 'beforeColon', settings('js.beforeColon'))

  if (wrap===true) wrap = -1

  let oComma = _colorfy(',', 'comma')
  let oColon = _colorfy(':', 'colon')
  let oBrace = _colorfy('{', 'brace')
  let eBrace = _colorfy('}', 'brace')
  let oBracket = _colorfy('[', 'bracket')
  let eBracket = _colorfy(']', 'bracket')
  let oNull = _colorfy('null', 'null')
  let oUndefined = _colorfy('undefined', 'undefined')

  let apad  = _.repeat(' ', arrayPadding)
  let opad  = _.repeat(' ', objectPadding)
  let comma = _.repeat(' ', beforeComma) + oComma + _.repeat(' ', afterComma)
  let colon = _.repeat(' ', beforeColon) + oColon + _.repeat(' ', afterColon)

  let fin = build(val,'')
  _CACHE = null
  return fin

  function safeObj(obj) {
    let res = {}
    _.forIn(obj, function(v, k) {
      if (_.includes(_CACHE, v)) return true
        _CACHE.push(v)
        res[k] = v
    })
    return res
  }

  function build(o,dent) {

    function buildFunction() {
      let okeys = _.keys(o)

      if(okeys.length) {
        o = safeObj(_.pick(o, okeys))
        //return buildObject()

        return build(o, '')
      } else {
        let signame = _sigName(o)
        var sigval = _.compact([signame || 'function', "(", _argNames(o).join(", "), ")"]).join("")
        return _colorfy(`"${sigval}"`, 'string')
      }
    }

    function buildArray() {
      if(_.isEmpty(o)) return oBracket+eBracket
      let pieces  = o.map((v) => { return build(v,'') })
      let arrLine = `${dent}${oBracket}${apad}${pieces.join(comma)}${apad}${eBracket}`
      if (wrap === false || arrLine.length <= wrap) return arrLine
      return `${dent}${oBracket}\n${ o.map((v) => { return build(v, dent + indent) }).join(`${oComma}\n`) }\n${dent}${eBracket}`
    }

    function buildObject() {
      let keyvals=[]
      let i = 0

      if(_.isEmpty(o)) return oBrace+eBrace

      _.forIn(o, (v, k) => {
        let kstr = JSON.stringify(k)
        kstr = _colorfy(kstr, 'key')
        keyvals[i++] = [kstr, build(v, '')]
      })

      if (sort) {
        keyvals = keyvals.sort((kv1,kv2) => {
          kv1 = kv1[0]
          kv2 = kv2[0]
          return kv1 < kv2 ? -1 : kv1 > kv2 ? 1 : 0
        })
      }

      keyvals = keyvals.map((kv) => { return kv.join(colon) }).join(comma)

      let objLine = `${oBrace}${opad}${keyvals}${opad}${eBrace}`

      if (wrap===false || objLine.length < wrap) return objLine

      keyvals = []
      i = 0

      _.forIn(o, (v, k) => {
        let kstr = JSON.stringify(k)
        kstr = _colorfy(kstr, 'key')
        keyvals[i++] = [`${dent}${indent}${kstr}`, v]
      })

      if (sort) {
        keyvals = keyvals.sort((kv1, kv2) => {
          kv1 = kv1[0]
          kv2=kv2[0]
          return kv1 < kv2 ? -1 : kv1 > kv2 ? 1 : 0
        })
      }

      if (align) {
        let longest = 0;
        for (let i=keyvals.length;i--;) if (keyvals[i][0].length > longest) longest = keyvals[i][0].length
        for (let i=keyvals.length;i--;) keyvals[i][0] = _.padEnd(keyvals[i][0], longest)
      }

      let indent2 = dent + indent;

      for (let i=keyvals.length; i--; ){
        let k = keyvals[i][0]
        let v = keyvals[i][1]
        let oLine = k + colon + build(v,'')
        keyvals[i] = (wrap===false || oLine.length <= wrap || !v || typeof v!="object") ? oLine : ( k + colon + build(v,indent2).replace(REGX_SPACES,''))
      }

      return `${dent}${oBrace}\n${keyvals.join(`${oComma}\n`)}\n${dent}${eBrace}`
    }

    function buildRegExp() { return dent + _colorfy(`"${o}"`, 'regex') }
    function buildString() { return dent + _colorfy(`"${_.trim(o)}"`, 'string') }
    function buildBoolean() { return dent + _colorfy(o, 'boolean') }
    function buildDefault() { return dent + o }
    function buildNumber() {
      let isFloat = Number(o) === o && o % 1 !== 0
      o = isFloat && decimals ? o.toFixed(decimals) : o + ''
      return dent + _colorfy(o, 'number')
    }

    if (o===null) return `${dent}${oNull}`
    if (o===undefined) return `${dent}${oUndefined}`
    if(_.isFunction(o)) return buildFunction()
    if(_.isRegExp(o)) return buildRegExp()
    if(_.isNumber(o)) return buildNumber()
    if(_.isString(o)) return buildString()
    if(_.isBoolean(o)) return buildBoolean()
    if(_.isArray(o)) return buildArray()
    if(_.isObject(o)) return buildObject()
    return buildDefault()
  }
}

/**
 * Highlighting now done within toPretty
 */

// function _mapVal(str) {
//   if (REGX_KEY_VAL.test(str)) return REGX_KEY.test(str) ? 'key' : 'string'
//   if (REGX_BOOLEAN.test(str)) return 'boolean'
//   if (REGX_NULL.test(str)) return 'null'
//   if (REGX_UNDEFINED.test(str)) return 'undefined'
//   return DEF_CLS
// }

// // returns method signature string "doSomething(time, place, whatever)"
// // or the val if not a function
// function sig(v, k) {
//   return _.isFunction(v) ? [k, "(", _argNames(v).join(", "), ")"].join("") : v;
// };

// function _highlight(json) {
//   let jstr = jsonFile.toString(json)

//   // this is for web/html
//   //jstr = jstr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

//   jstr = jstr.replace(REGX_JSON, (match) => {
//     let cls = _mapVal(match)
//     return _colorfy(match, cls)
//   })

//   // jstr = jstr.replace(REGX_BRACES, (match) => {
//   //   return _colorfy(match, 'brace')
//   // })

//   // jstr = jstr.replace(REGX_BRACKETS, (match) => {
//   //   return _colorfy(match, 'bracket')
//   // })

//   // jstr = jstr.replace(REGX_COMMAS, (match) => {
//   //   return _colorfy(match, 'comma')
//   // })

//   return jstr
// }