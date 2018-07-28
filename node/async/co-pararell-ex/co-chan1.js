'use strict';

var co = require('co');
var chan = require('co-chan');
var get = require('./get');

co(function*() {
  var ch = chan();

  get('a.txt', ch);
  var a = yield ch;

  get('b.txt', ch);
  var b = yield ch;

  get('c.txt', ch);
  var c = yield ch;

  console.log(a + b + c);
}).then(
  function (val) { console.info('ok: ' + val); },
  function (err) { console.error('ng: ' + err); });
