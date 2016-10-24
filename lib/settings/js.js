/**
 * JS Settings
 */
'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const clc = require('cli-color')

let _JS = {
  "indent": _.repeat(' ', fs.spaces),
  "wrap": 180,
  "sort": false,
  "align": true,
  "decimals": 3,
  "arrayPadding": 1,
  "objectPadding": 1,
  "afterComma": 1,
  "beforeComma": 0,
  "afterColon": 1,
  "beforeColon": 1,
  "colors": {
    "cls": "val",
    "color": clc.white,
    "colon": clc.white,
    "brace": clc.white,
    "bracket": clc.white,
    "comma": clc.white,
    "key": clc.blackBright,
    "val": clc.xterm(128),
    "null": clc.redBright,
    "undefined": clc.redBright,
    "string": clc.greenBright,
    "boolean": clc.magentaBright,
    "number": clc.magentaBright,
    "regex": clc.yellowBright
  }
}

module.exports = _JS