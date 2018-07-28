'use strict';

var co = require('co');
var get = require('./co-get');

co(function*() {
  var a = yield get('a.txt');
  var b = yield get('b.txt');
  var c = yield get('c.txt');
  console.log(a + b + c);
}).then(
  function (val) { console.info('ok: ' + val); },
  function (err) { console.error('ng: ' + err); });
