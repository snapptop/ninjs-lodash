/**
 * JSON Settings
 *
 * JSON.stringify(obj, json.stringify, json.indent)
 */
'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const clc = require('cli-color')

let _JSON = {
  "indent": _.repeat(' ', fs.spaces),
  "wrap": -1,
  "sort": false,
  "align": true,
  "decimals": undefined,
  "arrayPadding": 1,
  "objectPadding": 1,
  "afterComma": 1,
  "beforeComma": 0,
  "afterColon": 1,
  "beforeColon": 1,
  "colors": {
    "cls": "val",
    "color": clc.whiteBright,
    "colon": clc.cyanBright,
    "brace": clc.cyanBright,
    "bracket": clc.cyanBright,
    "comma": clc.cyanBright,
    "key": clc.blackBright,
    "val": clc.xterm(128),
    "null": clc.xterm(13),
    "undefined": clc.xterm(13),
    "string": clc.greenBright,
    "boolean": clc.magentaBright,
    "number": clc.magentaBright,
    "regex": clc.magentaBright
  }
}

module.exports = _JSON