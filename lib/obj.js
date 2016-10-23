/**
 * Object
 */
'use strict'

const _ = require('lodash')

const REGX_UTF_BOM = /^\uFEFF/

exports = module.exports = {
  "args": args,
  "avoke": avoke,
  "acquire": acquire,
  "acopy": acopy,
  "mcopy": mcopy,
  "mprops": mprops,
  "mergeArrays": mergeArrays
}

_.mixin(exports)

function args(argsarr) {
  argsarr = !_.isEmpty(argsarr) ? _.isArray(argsarr) ? argsarr : _.isArguments(argsarr) ? _.toArray(argsarr) : [argsarr] : []
  if(!argsarr || !_.isArray(argsarr) || argsarr.length === 0) return []
  return _.reduce(argsarr, function(result, val) {
    if(_.isArguments(val)) result = result.concat(_.toArray(val));
    else result.push(val);
    return result;
  }, [])
}

// attempt to invoke obj[key] -> Error Object returned if exception occurs
function avoke(obj, key) { return _.attempt(_.invoke, obj, key, _.drop(_.toArray(arguments), 2)) }

// attempt to require a file passing args to require
// if 2nd arg(err) is a bool and true -> return the error if an error occurs
// otherwise return null if error or return module if success
function acquire(src, err) {
  let mod = _.attempt(require, src)
  return mod ? _.isError(mod) ? _.isBoolean(err) && err ? mod : null : null : mod
}

// same as _.assign but does not alter first arg object
// assign WILL overwrite undefined values (from right to left)
function acopy() {
  let zargs = _.toArray(arguments)
  zargs.unshift({})
  return _.assign.apply(_, zargs)
}

// same as _.merge but does not alter first arg object
// merge WILL NOT overwrite undefined values (from right to left)
function mcopy() {
  let zargs = _.toArray(arguments)
  zargs.unshift({})
  return _.merge.apply(_, zargs)
}

function mprops(obj, withInfo) {
  let ret = {}
  _.forIn(obj, function (v, k) {
    ret[k] = mcopy(
      _.get(v, '__super__.constructor.__super__.constructor.__super__'),
      _.get(v, '__super__.constructor.__super__'),
      _.get(v, '__super__'),
      v)

    _.unset(ret[k], '__super__')
  })
  return withInfo ? info(ret) : ret
}

function mergeArrays(olds, news, key) {
  return _.chain(olds || [])
      .concat(news || [])
        .groupBy(key)
        .map(function(g) { return _.assign(g[0], g[1]) })
        .value()
}