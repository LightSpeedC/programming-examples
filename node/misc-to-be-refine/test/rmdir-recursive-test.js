// rmdir-recursive-test.js

'use strict';

var fs = require('fs');

var rmdirRecursive = require('rmdir-recursive').rmdirRecursive;
var rmdirRecursiveSync = require('rmdir-recursive').rmdirRecursiveSync;

function callback(err) {
  if (err) console.log(err);
}

if (process.platform === 'win32') {
  rmdirRecursiveSync('c:\\xxxx1');
  rmdirRecursiveSync('c:\\wwww1');
  rmdirRecursiveSync('c:/xxxx2');
  rmdirRecursiveSync('c:/wwww2');

  fs.mkdirSync('c:\\xxxx1');
  fs.mkdirSync('c:\\xxxx1\\yyyy');
  fs.mkdirSync('c:\\xxxx1\\yyyy\\zzzz');

  fs.mkdirSync('c:\\wwww1');
  fs.mkdirSync('c:\\wwww1\\xxxx');
  fs.mkdirSync('c:\\wwww1\\xxxx\\yyyy');
  fs.mkdirSync('c:\\wwww1\\xxxx\\yyyy\\xxxx');

  fs.mkdirSync('c:/xxxx2');
  fs.mkdirSync('c:/xxxx2/yyyy');
  fs.mkdirSync('c:/xxxx2/yyyy/zzzz');

  fs.mkdirSync('c:/wwww2');
  fs.mkdirSync('c:/wwww2/xxxx');
  fs.mkdirSync('c:/wwww2/xxxx/yyyy');
  fs.mkdirSync('c:/wwww2/xxxx/yyyy/xxxx');

  rmdirRecursiveSync('c:\\xxxx1');
  rmdirRecursive('c:\\wwww1', callback);
  rmdirRecursiveSync('c:/xxxx2');
  rmdirRecursive('c:/wwww2', callback);

  rmdirRecursive('c:\\xxxx3', callback);
  rmdirRecursive('c:\\wwww3', callback);
  rmdirRecursive('c:/xxxx4', callback);
  rmdirRecursive('c:/wwww4', callback);
}
else {
  rmdirRecursiveSync('/tmp/xxxx1');
  rmdirRecursiveSync('/tmp/wwww1');

  fs.mkdirSync('/tmp/xxxx1');
  fs.mkdirSync('/tmp/xxxx1/yyyy');
  fs.mkdirSync('/tmp/xxxx1/yyyy/zzzz');

  fs.mkdirSync('/tmp/wwww1');
  fs.mkdirSync('/tmp/wwww1/xxxx');
  fs.mkdirSync('/tmp/wwww1/xxxx/yyyy');
  fs.mkdirSync('/tmp/wwww1/xxxx/yyyy/xxxx');

  rmdirRecursiveSync('/tmp/xxxx1');
  rmdirRecursive('/tmp/wwww1', callback);
}

