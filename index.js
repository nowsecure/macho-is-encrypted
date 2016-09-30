'use strict'
const macho = require('macho')
const fatmacho = require('fatmacho')
const fs = require('fs')

const SYNC_API = {
  data: isEncryptedSyncData,
  path: isEncryptedSync
}

function hasEncLoadCmd (cmds, containTraces) {
  for (let cmd of cmds) {
    if (cmd.type === 'encryption_info' || cmd.type === 'encryption_info_64') {
      if (containTraces === true || typeof cmd.id !== 'undefined') {
        return true
      }
    }
  }
  return false
}

function isEncryptedSyncData (data, containTraces) {
  try {
    const exec = macho.parse(data)
    return hasEncLoadCmd(exec.cmds, containTraces)
  } catch (e) {
    const fat = fatmacho.parse(data)
    for (let bin of fat) {
      const exec = macho.parse(bin.data)
      if (hasEncLoadCmd(exec.cmds, containTraces)) {
        return true
      }
    }
  }
  return false
}

function isEncryptedSync (path, containTraces) {
  const data = fs.readFileSync(path)
  return isEncryptedSyncData(data, containTraces)
}

module.exports = SYNC_API
