/**
 * Launch -> child_process.exec or child_process.execFile defaults
 */
'use strict'

const _ = require('lodash')

let _LAUNCH = {

  "cmd": "",

  // <String> Current working directory of the child process
  "cwd": process.cwd(),

  "type": "exec",

  "args": [],

  "switches": {},

  // <Object> Environment key-value pairs (must be process.env and not null, otherwise errors may occur)
  // env: _.assign({}, process.env),

  "shell": "cmd.exe",
  //shell: _.path.join('C:', 'Users', 'Stuart', 'Desktop', 'cmder', 'Cmder.exe'),

  "timeout": 0,

  // <String> (Default: 'SIGTERM')
  "killSignal": "SIGTERM",

  // <Number> largest amount of data (in bytes) allowed on stdout or stderr
  "maxBuffer": 1024*1024,

  "encoding": "utf8"

}

module.exports = _LAUNCH