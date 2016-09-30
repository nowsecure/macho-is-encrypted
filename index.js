'use strict';
const macho = require('macho');
const fatmacho = require('fatmacho');
const fs = require('fs');

const SYNC_API = {
  data: isEncryptedSyncData,
  path: isEncryptedSync
};

const ENC_STATE = {
  not: 'not_encrypted',
  now: 'now_encrypted',
  previously: 'prevously_encrypted'
};

function hasEncLoadCmd (cmds) {
  for (let cmd of cmds) {
    if ((/^encryption_info/).test(cmd.type)) {
      let state;
      if (cmd.id === 1) {
        state = ENC_STATE.now;
      } else if (typeof cmd.id !== 'undefined') {
        state = ENC_STATE.previously;
      }
      return {
        type: cmd.type,
        state: state
      };
    }
  }
  return { state: ENC_STATE.not };
}

function isEncryptedSyncData (data) {
  try {
    const exec = macho.parse(data);
    return hasEncLoadCmd(exec.cmds);
  } catch (e) {
    const fat = fatmacho.parse(data);
    for (let bin of fat) {
      const exec = macho.parse(bin.data);
      const maybeCmd = hasEncLoadCmd(exec.cmds);
      if (maybeCmd) {
        return maybeCmd;
      }
    }
  }
  return false;
}

function isEncryptedSync (path) {
  const data = fs.readFileSync(path);
  return isEncryptedSyncData(data);
}

module.exports = SYNC_API;
