/**
 * Process
 */
'use strict'

const _ = require('lodash')
const fs = require('fs-extra')

let _CACHE = {};

let _REQUIRE = {
  "extensions": {
    ".md": (mod, filepath) => {
      mod.exports = _CACHE[filepath] || fs.readFileSync(filepath, "utf8")
      _CACHE[filepath] = mod.exports
      return mod
    },
    ".module": (mod, filepath) => {
      mod.exports = filepath
      return mod
    }
  }
}

module.exports = _REQUIRE