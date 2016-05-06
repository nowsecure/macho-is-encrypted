# SYNOPSIS

Check if your Mach-O bin is encrypted.

```js
var fs = require('fs')
var isEncryptedSync = require('macho-is-encrypted')

var execPath = process.execPath
var data = fs.readFileSync(execPath)

console.log(isEncryptedSync.path(path))
console.log(isEncryptedSync.data(data))
```

# LICENSE

MIT

