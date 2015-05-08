// mkdir-parents-test.js

'use strict';

var mkdirParents = require('mkdir-parents').mkdirParents;
var mkdirParentsSync = require('mkdir-parents').mkdirParentsSync;

function callback(err) {
  if (err) console.log(err);
}

if (process.platform === 'win32') {
  mkdirParentsSync('c:\\xxxx1\\yyyy\\zzzz');
  mkdirParentsSync('c:\\wwww1\\xxxx\\yyyy\\xxxx');
  mkdirParentsSync('c:/xxxx2/yyyy/zzzz');
  mkdirParentsSync('c:/wwww2/xxxx/yyyy/xxxx');
  mkdirParents('c:\\xxxx3\\yyyy\\zzzz', callback);
  mkdirParents('c:\\wwww3\\xxxx\\yyyy\\xxxx', callback);
  mkdirParents('c:/xxxx4/yyyy/zzzz', callback);
  mkdirParents('c:/wwww4/xxxx/yyyy/xxxx', callback);
}
else {
  mkdirParentsSync('/tmp/xxxx1/yyyy/zzzz');
  mkdirParentsSync('/tmp/wwww1/xxxx/yyyy/xxxx');
  mkdirParents('/tmp/xxxx2/yyyy/zzzz', callback);
  mkdirParents('/tmp/wwww2/xxxx/yyyy/xxxx', callback);
}
