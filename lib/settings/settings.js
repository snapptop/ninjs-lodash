/**
 * Settings -> merge(os, env, globals, .folders, .files, config)
 */
'use strict'

const _ = require('lodash')
const path = require('path')

// all setting defaults
let _SETTINGS = {
  "env": require('./env'),
  "account": require('./account'),
  "json": require('./json'),
  "js": require('./js'),
  "proc": require('./proc'),
  "os": require('./os'),
  "paths": require('./paths'),
  "require": require('./require'),
  "launch": require('./launch'),
  "modules": require('./modules'),
  "sites": require('./sites'),
  "apps": require('./apps'),
  "trons": require('./trons'),
  "docs": require('./docs')
}

exports = module.exports = ctor

// load cwd .ninjs settings
load(path.join(process.cwd(), '.ninjs', 'settings.js'))
load(path.join(process.cwd(), '.ninjs', 'settings.json'))

// assign exports and global lodash (_) object
_.assign(exports, _SETTINGS)
_.assign(_, { "$": ctor, "$load": load })

//getter/setter
function ctor(k, v) {
  if(k && _.isString(k) && k.indexOf('paths.') === 0) return get.apply(null, _.toArray(arguments))
  return v ? set(k, v) : get(k)
}

//get setting key
function get(k) {
  if(!k) return _SETTINGS
  let v = _.get(_SETTINGS, k)
  if(!v) return
  if(_.isString(k) && k.indexOf('paths.') !== 0) return v
  let args = _.drop(_.toArray(arguments))
  let argsLength = args.unshift(v)
  return path.join.apply(path, args)
}

//set setting key with val (merged if already exists and is plain object {})
function set(k, v) {
  let curr = get(k)
  if(curr && _.isPlainObject(curr) && _.isPlainObject(v)) v = _.mcopy(curr, v)
  if(k) _.set(_SETTINGS, k, v)
  if(!k) _SETTINGS = v
  return get(k)
}

// require src and merge with SETTINGS if exists
function load(src) {
  if(!src || !_.isString(src)) return
  let file = _.attempt(require, src)
  if(!file || _.isError(file) || !_.isPlainObject(file)) return
  return _.merge(_SETTINGS, file)
}