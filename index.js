'use strict'
const macho = require('macho')
const fatmacho = require('fatmacho')
const fs = require('fs')

const SYNC_API = {
  data: isEncryptedSyncData,
  path: isEncryptedSync
}

function hasEncLoadCmd (cmds) {
  for (let cmd of cmds) {
    if (cmd.type === 'encryption_info' || cmd.type === 'encryption_info_64') {
      if (cmd.id === 1) {
        return true
      }
    }
  }
  return false
}

function isEncryptedSyncData (data) {
  try {
    const exec = macho.parse(data)
    return hasEncLoadCmd(exec.cmds)
  } catch (e) {
    const fat = fatmacho.parse(data)
    for (let bin of fat) {
      const exec = macho.parse(bin.data)
      if (hasEncLoadCmd(exec.cmds)) { return true }
    }
  }
  return false
}

function isEncryptedSync (path) {
  const data = fs.readFileSync(path)
  return isEncryptedSyncData(data)
}

module.exports = SYNC_API
