/**
 * Child Process Utils
 */
'use strict'

const _ = require('lodash')
const cproc = require("child_process")
const settings = require('./settings')
const path = require('./path')
const async = require('./async')
const debug = require('./debug')

const DEFAULTS = _.$('launch')
const JARGV = _.$('env.jargv')

exports = module.exports = {
  "exec": exec,
  "execFile": execFile,
  "cmd": cmd
}

_.mixin(exports)

// ~~~~~ CHILD PROCESS ~~~~~~

// child_process.exec(command[, options][, callback])
function exec(options, callback) {
  return cmd(_.assign(options, { type:'exec' } ), _.cb(callback))
}

// child_process.execFile(file[, args][, options][, callback])
function execFile(options, callback) {
  return cmd(_.assign(options, { type:'execFile' } ), _.cb(callback))
}

// runs exec or exexfile
// 'modules.writePaths': { cmd: 'node', args: ['test', 'modules.writePaths'], switches: { dest: _.path.join(TEMP_PATH, 'paths.json') } },
function cmd(options, callback) {
  let opts = _.merge({}, DEFAULTS, options)
  let { cmd='', type='', args=[], switches={} } = opts

  type = type && _.isString(type) && _.includes(['exec', 'execFile'], type) ? type : 'exec'
  args = args && _.isArray(args) ? args : []
  switches = switches && _.isPlainObject(switches) ? _.merge(switches, _.omit(JARGV || {}, ['_'])) || {} : {}

  let method = _.get(cproc, type)

  if(!cmd || !_.isString(cmd)) return _.fail('Invalid cmd', callback)
  if(!_.isFunction(method)) return _.fail('Invalid type', callback)

  _.forIn(switches, (v, k) => {
    if(!v && !k) return
    let arg = v && k ? `--${k}=${v}` : `--${k || v}`
    if(arg) args.push(arg)
  })

  args = _.compact(args)

  let isExec = type === 'exec'

  _.assign(opts, { args: args  })
  opts = _.omit(opts, ['type', 'switches'])

  // exec does not take args argument like execFile
  // -> must join args with ' ' and append to cmd prop to create command
  if(isExec) cmd = _.join([cmd, _.join(args, ' ')], ' ')

  let cb = (err, stdout, stderr) => {
    if(err) return _.fail(err, callback)
    _.done({ stdout: stdout, stderr: stderr }, callback)
  }

  const child = isExec ? _.attempt(method, cmd, opts, cb) : _.attempt(method, cmd, args, opts, cb)
  return child
  //return _handleChild(child, _.cb(callback))
}

// handles newly created child process via cproc.exec OR cprop.execFile
// ** child.on('close', (code) => {}) is basically the only event that is called
// ** use stdout/stderr to handle fail/done on 'close' event !!!
function _handleChild(child, callback) {
  if(!child) return _.fail('Invalid child process', callback)
  if(_.isError(child)) return _.fail(child, callback)

  let stdout = ''
  let stderr = ''

  child.stdout.on('data', function(data) { stdout += data })
  child.stderr.on('data', function(data) { stderr += data })

  child.on('close', function(code) { return _.done(stdout || stderr, callback) })
  child.on('disconnect', function(err) {})
  child.on('error', function(err) { })
  child.on('exit', function(code, signal) { })
  child.on('message', function(message, sendHandle) { })

  return child
}