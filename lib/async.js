/**
 * Async Utils
 */
'use strict'

const _ = require('lodash')
const async = require('async')

// async additions
const _ASYNC = {
  "done": done,
  "fail": fail,
  "cb": cb,
  "notcb": notcb,
  "acb": acb
}

_.unset(async, 'default')

// export _ASNYC extras
exports = module.exports = _ASYNC

// mixin extra async methods directly to _ object -> ie. _.cb(fn)
_.mixin(_ASYNC)

// assign async to _ object for convenience -> ie. _.async.map
_.assign(_, { async: async })

// wrap async success callback
function done(result, callback) {
  if (!_.isFunction(callback)) return
  process.nextTick(function () { callback(null, result) })
}

// wrap async error callback
function fail(err, callback) {
  if (!_.isFunction(callback)) return
  let uError = new Error('Unknown Error')
  err = err ? _.isError(err) ? err : _.isString(err) ? new Error(err) : uError : uError
  process.nextTick(function () { callback(err) })
}

// wrap callback
function cb(callback) {
  callback = _.isArguments(callback) ? acb(callback) : callback
  return function (err, result) {
    if (err) return fail(err, callback)
    done(result, callback)
  }
}

// make sure src is not typeof function, otherwise return def (default)
function notcb(src, def) { return !_.isFunction(src) ? src : def || null }

// reverse scans args for [Function] || null
// -> used for grabbing callback from dynamic args
// returns first arg that is typeof function from right to left
function acb(args) {
  args = _.toArray(args)
  return _.find(_.reverse(args), function (arg) { return _.isFunction(arg) }) || function () { }
}