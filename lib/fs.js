/**
 * File System Utils
 */
'use strict'

const _ = require('lodash')
const fs = require('fs-extra')
const _path = require('./path')
const _async = require('./async')
const _files = require('./files')

exports = module.exports = {
  "exists": exists,
  "copy": copy,
  "rename": rename,
  "remove": remove,
  "move": move,
  "dirPaths": dirPaths,
  "ensureDir": ensureDir,
  "mkdirs": mkdirs,
  "emptyDir": emptyDir,
  "readFile": readFile,
  "outputFile": outputFile,
  "readJson": readJson,
  "outputJson": outputJson,
  "tree": tree
}

_.assign(_, { fs: fs })

_.mixin(exports)

function ostat(options, callback) {
  let path = _.get(options, 'path') || ''
  let root = _.get(options, 'root') || ''

  if(!path) return _.fail('Invalid path', callback)

  return fs.lstat(path, (err, stat) => {
    if (err) return _.fail(err, callback)

    let rel = root ? path.replace(root, '') : path
    rel = _.startsWith(rel, _.path.sep) ? rel.substr(1) : rel

    let url = `/${rel ? rel.replace(_.path.sep, '/') : ''}`

    //let cleanStat = _._.omit(stat, ['uid', 'gid', 'rdev', 'nlink', 'mode', 'dev', 'ino', 'atime', 'mtime', 'ctime', 'birthtime'])
    let isDir = stat.isDirectory()
    let isSym = stat.isSymbolicLink()
    let isFifo = stat.isFIFO()
    let isSocket = stat.isSocket()
    let size = _.get(stat, 'size') || 0
    let result = _.assign({
      isDir: isDir,
      isFile: !isDir,
      isSym: isSym,
      //isFifo: isFifo,
      //isSocket: isSocket,
      url: url,
      rel: rel,
      root: root,
      path: path,
      size: size,
      sizef: ''
    }, isDir ? { dirs: [], files: [] } : {})

    return _.done(result, callback)
  })
}

function exists(src, callback) {
  return fs.access(src, fs.constants.F_OK, (err) => {
    return err ? _.fail(err, callback) : _.done(src, callback)
  })
}

function copy(src, dest, callback) { return fs.copy(src, dest, _.cb(callback)) }
function rename(src, dest, callback) { return fs.rename(src, dest, _.cb(callback)) }
function remove(src, callback) { return fs.remove(src, _.cb(callback)) }
function move(src, dest, callback) { return fs.move(src, dest, _.cb(callback)) }

function dirPaths(src, callback) {
  return fs.readdir(src, (err, results) => {
    if(err) return _.fail(err, callback)
    return _.done(_.map(results, (result) => { return _.path.join(src, result) }), callback)
  })
}


function ensureDir(src, callback) { return fs.ensureDir(src, _.cb(callback)) }
function mkdirs(src, callback) { return fs.mkdirs(src, _.cb(callback)) }
function emptyDir(src, callback) { return fs.emptyDir(src, _.cb(callback)) }

function readFile(src, callback) { return fs.readFile(src, 'utf8', _.cb(callback)) }
function outputFile(src, data, callback) {
  return fs.outputFile(src, data, (err) => {
    return err ? _.fail(err, callback) : _.done(src, callback)
  })
}

function readJson(src, callback) { return fs.readJson(src, _.cb(callback)) }
function outputJson(src, obj, callback) {
  if(!src || !obj || !_.path.ex(src) === 'json') return _.fail('Invalid src', callback)
  return outputFile(src, _.files.json.toString(obj), callback)
}

function tree(options, callback) {
  let root = _.get(options, 'root')
  let excludes = _.get(options, 'excludes') || []

  ostat(options, (err, result) => {
    if (err) return _.fail(err, callback)

    function allDone() {
      let total = 0;
      _.each(result.files, (file) => { total += file.size })
      _.each(result.dirs, (dir) => { total += dir.size })
      result.size = total
      result.sizef = _.bytes(total)
      _.done(result, callback)
    }

    if(!result.isDir) {
      return _.done(result, callback)
    } else {
      fs.readdir(result.path, (err, list) => {
        if (err) return _.fail(err, callback)

        list = excludes && excludes.length ? _.filter(list, (item) => { return !_.includes(excludes, item) }) : list

        let pending = list.length
        if (!pending) return _.done(result, callback)

        _.each(list, (file) => {
          ostat({ path: _.path.join(result.path, file), root: root  }, (err, child) => {
            if (err) return _.fail(err, callback)

            if (child.isDir) {
              tree({ path: child.path, root: root, excludes: excludes  }, (err, res) => {

                let total = 0;
                _.each(res.files, (file) => { total += file.size })
                _.each(res.dirs, (dir) => { total += dir.size })
                res.size = total
                res.sizef = _.bytes(total)
                result.dirs.push(res)

                //console.log(res)
                if (!--pending) allDone()
                //return _.done(result, callback)
              })
            } else {
              child.sizef = _.bytes(child.size)
              result.files.push(child)
              if (!--pending) allDone()
            }
          })
        })
      })
    }
  })
}


// ~~~~~ FS ~~~~~

// CONFIG
// _log(fs.spaces)
// _log(fs.jsonfile)

// // MISC
// gracefulify

// TIMESTAMPS
// utimes
// futimes
// lutimes

// // PATHS
// access
// fs.realpath(__dirname, (err, result) => { _log(result) })
// fstat
// lstat
// stat
// exists

// // DIRS AND FILES
// copy
// rename
// watch
// remove
// move

// // DIRS
// rmdir
// fsync
// mkdir
// readdir
// mkdtemp
// mkdirs
// mkdirp
// ensureDir
// emptyDir
// emptydir
// walk

// // FILES
// readFile
// writeFile
// outputFile
// appendFile
// createFile
// ensureFile
// watchFile
// unwatchFile
// truncate
// ftruncate

// // LINKS
// readlink
// symlink
// link
// unlink
// createLink
// ensureLink
// createSymlink
// ensureSymlink

// // PERMS
// fchmod
// chmod
// fchown
// chown
// lchown
// lchmod

// // STREAMS
// close
// open
// read
// write
// createReadStream
// ReadStream
// FileReadStream
// createWriteStream
// WriteStream
// FileWriteStream

// // JSON
// readJson
// readJSON
// writeJson
// writeJSON
// outputJson
// outputJSON