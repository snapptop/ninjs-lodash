/**
 * Process Environment
 */
'use strict'

const _ = require('lodash')
const path = require('path')
const minimist = require('minimist')

const ARGV = process.argv
const JARGV = minimist(ARGV.slice(2))

const ENV_CLEAN = _.omit(process.env, ['Path'])
const ENV_PATH = process.env['Path']
const ENV_PATHS = ENV_PATH.split(path.delimiter)

const NODE_ENV = getNodeEnv()
const DEBUG_ENV = getDebugEnv()

function get(key) { return _.get(process.env, key) }
function set(key, v) { _.set(process.env, key, v); return get(key) }
function getNodeEnv() { return _.get(JARGV, 'env') || get('NODE_ENV') || 'development' }
function getDebugEnv() { return _.get(JARGV, 'debug') || get('DEBUG') || (getNodeEnv() === 'production' ? '' : '*') }

// update process.env variables
// ** could be different if passed in via command line args
set('NODE_ENV', NODE_ENV)
set('DEBUG', DEBUG_ENV)

let _ENV = {
// ARGS

  "argv": ARGV,

  "jargv": JARGV,

// NODE

  "node": {

    // 'C:\\Users\\Stuart\\AppData\\Roaming\\npm\\node_modules'
    "root": get('NODE_PATH'),

    // 'development' || 'production'
    "env": NODE_ENV

  },

// DEBUG

  "debug": {

    // 'development' || 'production'
    "env": DEBUG_ENV

  },

// GIT

  "git": {

    // 'C:\\Program Files\\Git'
    "root": get('GIT_INSTALL_ROOT')

  },

// FFMPEG

  "ffmpeg": {

    // 'C:\\FFMPEG\\bin\\ffmpeg.exe'
    "root": get('FFMPEG_PATH'),

    // 'C:\\FFMPEG\\bin\\ffprobe.exe'
    "probe": get('FFPROBE_PATH')

  },

// TERMINAL

  "terminal": {

    // '.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC;.RB;.RBW'
    "ext": get('PATHEXT'),

    // 'C\bL\bI\bN\bK\b \b$P$G'
    "prompt": get('PROMPT'),

    // 'cygwin'
    "term": get('TERM')

  },

// CMDER

  "cmder": {

    // 'C:\\Users\\Stuart\\Desktop\\cmder\\config\\user-aliases.cmd'
    "aliases": get('aliases'),

    // 'C:\\Users\\Stuart\\Desktop\\cmder\\config\\user-aliases.cmd'
    "user_aliases": get('user-aliases'),

    // '0'
    "verbose": get('verbose-output')

  },

// USER

  "user": {

    // 'Stuart'
    "name": get('USERNAME'),

    // 'C:\\Users\\Stuart'
    "profile": get('USERPROFILE'),

    // 'C:'
    "drive": get('HOMEDRIVE'),

    // 'C:\\Users\\Stuart'
    "home": get('HOME'),

    // '\\Users\\Stuart'
    "homepath": get('HOMEPATH'),

    // 'C:\\Users\\Public'
    "public": get('PUBLIC'),

    // 'C:\\Users\\Stuart\\AppData\\Roaming'
    "data": get('APPDATA'),

    // 'C:\\Users\\Stuart\\AppData\\Local'
    "local": get('LOCALAPPDATA'),

    // 'C:\\Users\\Stuart\\AppData\\Local\\Temp'
    "temp": get('TEMP') || get('TMP'),

    // 'STUPC'
    "domain": get('USERDOMAIN'),

    // 'STUPC'
    "roaming": get('USERDOMAIN_ROAMINGPROFILE')

  },

// SYSTEM

  // __COMPAT_LAYER:'Installer'

  "system": {

    // 'C:'
    "drive": get('SystemDrive'),

    // 'C:\\WINDOWS'
    "root": get('SystemRoot'),

    // 'C:\\WINDOWS'
    "windir": get('windir')

  },

// PROGRAMS

  // 'ProgramFiles(x86)': 'C:\\Program Files (x86)',
  // ProgramW6432: 'C:\\Program Files'

  "programs": {

    // 'C:\\Program Files'
    "root": get('ProgramFiles'),

    // 'C:\\Program Files\\Common Files'
    "common": get('CommonProgramFiles'),

    // 'C:\\ProgramData'
    "data": get('ProgramData'),

    // 'C:\\ProgramData'
    "allusers": get('ALLUSERSPROFILE')

  },

// PLATFORM

  "platform": {

    // 'STUPC'
    "name": get('COMPUTERNAME'),

    // 'Windows_NT'
    "os": get('OS'),

    // '\\\\STUPC'
    "server": get('LOGONSERVER'),

    // PROCESSORS
    "cpu": {

      // 'Intel64 Family 6 Model 60 Stepping 3, GenuineIntel'
      "id": get('PROCESSOR_IDENTIFIER'),

      // 'AMD64'
      "arch": get('PROCESSOR_ARCHITECTURE'),

      // '8'
      "num": get('NUMBER_OF_PROCESSORS'),

      // '6'
      "level": get('PROCESSOR_LEVEL'),

      // '3c03'
      "rev": get('PROCESSOR_REVISION')

    }

  },

// OPENSSL

  "openssl": {

    // 'C:\\OpenSSL-Win64\\openssl.cnf'
    "root": get('OPENSSL_CONF')

  },

// PLINK

  "plink": {

  // 'ssh'
    "protocol": get('PLINK_PROTOCOL')

  },

// SVN

  "svn": {

    // 'C:\\\\ProgramFiles\\\\Git\\\\bin\\\\ssh.exe'
    "root": get('SVN_SSH')

  },

// VISUAL STUDIO

  "vs": {

    // 'C:\\ProgramFiles(x86)\\MicrosoftVisualStudio11.0\\Common7\\Tools\\'
    "VS110": get('VS110COMNTOOLS'),

    // 'C:\\ProgramFiles(x86)\\MicrosoftVisualStudio12.0\\Common7\\Tools\\'
    "VS120": get('VS120COMNTOOLS'),

    // 'C:\\ProgramFiles(x86)\\MicrosoftVisualStudio14.0\\Common7\\Tools\\'
    "VS140": get('VS140COMNTOOLS'),

    // 'C:\\ProgramFiles(x86)\\MicrosoftVisualStudio12.0\\VSSDK\\'
    "VSSDK120": get('VSSDK120Install'),

    // 'C:\\ProgramFiles(x86)\\MicrosoftVisualStudio14.0\\VSSDK\\'
    "VSSDK140": get('VSSDK140Install')

  },

// PATHS

  "paths": ENV_PATHS

}

module.exports = _ENV