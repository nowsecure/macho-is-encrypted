#!/usr/bin/env node
'use strict';

const usage = `
  ${process.argv[1]} <path>
`;

if (!process.argv[2]) {
  console.error(usage);
  process.exit(1);
}

const encrypted = require('.').path(process.argv[2]);

console.log(`state: ${encrypted.state}`);
if (encrypted.type) {
  console.log(`type: ${encrypted.type}`);
}
