'use strict'
const test = require('tape')
const isEncryptedSync = require('.')
const fs = require('fs')

const execPath = process.execPath
const data = fs.readFileSync(execPath)

test('sync api - data', function (t) {
  t.ok(!isEncryptedSync.data(data), 'not encrypted')
  t.end()
})

test('sync api - path', function (t) {
  t.ok(!isEncryptedSync.path(execPath), 'not encrypted')
  t.end()
})
