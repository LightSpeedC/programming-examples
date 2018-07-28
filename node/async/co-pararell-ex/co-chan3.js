'use strict';

var co = require('co');
var chan = require('co-chan');
var get = require('./get');

co(function*() {
  var ch_a = chan();
  var ch_b = chan();
  var ch_c = chan();

  get('a.txt', ch_a);
  get('b.txt', ch_b);
  var a = yield ch_a;
  var b = yield ch_b;

  get('c.txt', ch_c);
  var c = yield ch_c;

  console.log(a + b + c);
}).then(
  function (val) { console.info('ok: ' + val); },
  function (err) { console.error('ng: ' + err); });
