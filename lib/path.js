/**
 * Path Wrapper + Utils
 * ninjs.lodash.path
 */
'use strict'

const _ = require('lodash')
const path = require('path')

const REGX_DOTS = /\./g
const EXCLUDES = ['win32', 'posix']

exports = module.exports = _.assign({}, _.omit(path, EXCLUDES), {

  // Parse
  "parses": parses,
  "root": root,
  "roots": roots,
  "dir": dir,
  "dirs": dirs,
  "base": base,
  "bases": bases,
  "name": name,
  "names": names,
  "ext": ext,
  "exts": exts,
  "ex": ex,
  "exs": exs,
  "cleanExt": cleanExt,
  "ensureExt": ensureExt,
  "full": full,
  "abs": abs,

  // Format
  "ns": ns,
  "nspath": nspath,
  "diff": diff,
  "rel": rel,
  "rebase": rebase

  // // Mime Types
  // "type": type,
  // "ltype": ltype,
  // "rtype": rtype,

  // // Text
  // "isText": isText,

  // // Javascript
  // "isJs": isJs,

  // // Css
  // "isCss": isCss,
  // "isSass": isSass,
  // "isLess": isLess,
  // "isCssLike": isCssLike,

  // // Html
  // "isHtml": isHtml,

  // // Image
  // "isImage": isImage,
  // "isGif": isGif,

  // // Audio / Video
  // "isAudio": isAudio,
  // "isVideo": isVideo,
  // "isAudioOrVideo": isAudioOrVideo,

  // // Application
  // "isApplication": isApplication,

  // // Executables
  // "isExe": isExe,

  // // JSON
  // "isJson": isJson,

  // // Fonts
  // "isEot": isEot,
  // "isSvg": isSvg,
  // "isTtf": isTtf,
  // "isWoff": isWoff,
  // "isWoff2": isWoff2,
  // "isWoffLike": isWoffLike,
  // "isFont": isFont,

  // // Special
  // "isDotFile": isDotFile,
  // "isCode": isCode,
  // "isNotAllowed": isNotAllowed,
  // "isMessage": isMessage

})

_.assign(_, { path: exports })

/**
 * Parse
 */

function parses(arr) { return _.isArray(arr) ? _.map(arr, function (src) { return path.parse(src) }) : [] }
function root(src) { return path.parse(src).root }
function roots(arr) { return _.isArray(arr) ? _.map(arr, function (src) { return root(src) }) : [] }
function dir(src) { return path.parse(src).dir }
function dirs(arr) { return _.isArray(arr) ? _.map(arr, function (src) { return dir(src) }) : [] }
function base(src) { return path.parse(src).base }
function bases(arr) { return _.isArray(arr) ? _.map(arr, function (src) { return base(src) }) : [] }
function name(src) { return path.parse(src).name }
function names(arr) { return _.isArray(arr) ? _.map(arr, function (src) { return name(src) }) : [] }
function ext(src) { return path.parse(src).ext }
function exts(arr) { return _.isArray(arr) ? _.map(arr, function (src) { return ext(src) }) : [] }

function ex(src) {
  let val = ext(src)
  return val ? val.replace('.', '') : ''
}

function exs(arr) {
  return _.isArray(arr) ? _.map(arr, function (src) { return ex(src) }) : []
}

function cleanExt(val) {
  return val ? val.indexOf('.') === 0 ? val : '.' + val : ''
}

function ensureExt(src, val) {
  if (!src || !_.isString(val)) return src || ''
  let result = path.parse(src)
  return path.join(result.dir, result.name + (result.ext || cleanExt(val)))
}

function full(rootpath, src, end) {
  if (!rootpath || !_.isString(rootpath)) return src || ''
  if (!src || !_.isString(src)) return ''

  src = path.isAbsolute(src) ? src : path.join(rootpath, src)
  if (!end || !_.isString(end)) return src
  return ensureExt(src, end)
}

function abs(src, file) {
  if (!src || !_.isString(src)) return ''
  src = path.isAbsolute(src) ? path.resolve(src) : path.join(process.cwd(), src)
  return file ? path.join(src, file) : src
}

/**
 * FORMAT
 */

// returns formatted /path/to/file.js -> path.to.file
function ns(rootpath, src) {
  return _.compact(src.replace(rootpath, '').split(path.sep)).join('.')
}

// return rel path of namespace (ns -> 'parent.folder.item')
function nspath() {
  let src = _.join(_.filter(_.toArray(arguments), function(arg) { return arg && _.isString(arg) }), '.')
  if(!src) return ''
  return _.replace(src, REGX_DOTS, '/')
}

// returns forward-slashed rel path (only use for better visual logging)
function diff(rootpath, src) {
  return _.isString(rootpath) && _.isString(src) ?
    src.replace(rootpath, '').split(path.sep).join('/') : ''
}

// returns rel path of src from root
function rel(root, src, sep) {
  if(!root || !_.isString(root) || !src || !_.isString(src)) return
  let root_split = root.split(path.sep),
    src_split = src.split(path.sep)
  return _.join(_.difference(src_split, root_split), sep || '/')
}

// returns rel appended to dest root
function rebase(root, src, dest) {
  let relp = rel(root, src)
  return relp ? path.join(dest, relp) : ''
}

/**
 * Mime Types
 */

// // returns mapped ex -> content-type
// function type(src) {
//   let srcEx = ex(src),
//     mapped = srcEx ? mimeTypes[srcEx.toLowerCase()] || defaultMimeType : defaultMimeType
//   return _.trim(mapped).toLowerCase()
// }

// // returns left portion (type) of mime/type -> (ie. mime)
// function ltype(src) {
//   let val = type(src),
//     split = val ? val.split('/') : []
//   if (split.length < 1) return ''
//   return _.trim(split[0]).toLowerCase()
// }

// // returns right portion (subtype) of mime/type -> (ie. type)
// function rtype(src) {
//   let val = type(src),
//     split = val ? val.split('/') : []
//   if (split.length < 2) return ''
//   return _.trim(split[1]).toLowerCase()
// }

// /**
//  * Text
//  */
// function isText(src) { return ltype(src) === 'text' } // text/*

// /**
//  * Javascript
//  */
// function isJs(src) { return rtype(src) === 'javascript' } // text/javascript

// /**
//  * Css
//  */
// function isCss(src) { return rtype(src) === 'css' } // text/css
// function isSass(src) { return rtype(src) === 'x-scss' } // text/x-scss
// function isLess(src) { return ex(src) === 'less' } // .less
// function isCssLike(src) { return isCss(src) || isSass(src) || isLess(src) }

// /**
//  * Html
//  */
// function isHtml(src) { return rtype(src) === 'html' } // text/html

// /**
//  * Image
//  */
// function isImage(src) { return ltype(src) === 'image' } // image/*
// function isGif(src) { return rtype(src) === 'gif' } // image/gif

// /**
//  * Audio / Video
//  */
// function isAudio(src) { return ltype(src) === 'audio' } // audio/*
// function isVideo(src) { return ltype(src) === 'video' } // video/*
// function isAudioOrVideo(src) { return isAudio(src) || isVideo(src) } // audio/* || video/*

// /**
//  * Application
//  */
// function isApplication(src) { return ltype(src) === 'application' } // application/*
// function isExe(src) { return rtype(src) === 'x-msdownload' } // application/x-msdownload

// /**
//  * JSON
//  */
// function isJson(src) { return rtype(src) === 'json' } // application / json

// /**
//  * Fonts
//  */
// function isEot(src) { return rtype(src) === 'vnd.ms-fontobject' } // application/vnd.ms-fontobject
// function isSvg(src) { return rtype(src) === 'svg+xml' } // application/svg+xml
// function isTtf(src) { return rtype(src) === 'x-font-ttf' } // application/x-font-ttf
// function isWoff(src) { return rtype(src) === 'x-font-woff' } // application/x-font-woff
// function isWoff2(src) { return ex(src) === 'woff2' } // .woff2
// function isWoffLike(src) { return isWoff(src) || isWoff2(src) }
// function isFont(src) { return isEot(src) || isSvg(src) || isTtf(src) || isWoffLike(src) }

// /**
//  * Special
//  */
// function isDotFile(src) { return _.startsWith(name(src), '.') } // .file
// function isCode(src) { return isJs(src) } // code
// function isNotAllowed(src) { return isExe(src) } // uploading
// function isMessage(src) { return ltype(src) === 'message' } // message/*