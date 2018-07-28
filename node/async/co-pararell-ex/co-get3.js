'use strict';

var co = require('co');
var get = require('./co-get');

co(function*() {
  var res = yield {a: get('a.txt'),
                   b: get('b.txt')};
  res.c = yield get('c.txt');
  console.log(res.a + res.b + res.c);
}).then(
  function (val) { console.info('ok: ' + val); },
  function (err) { console.error('ng: ' + err); });
