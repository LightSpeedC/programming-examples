'use strict';

var co = require('co');
var chan = require('co-chan');

var ch = chan();

// *** FIRST THREAD ***
co(function*() {
  // send sync
  yield ch('(a)');

  // receive
  var b = yield ch;
  console.log(b);

  // send async
  ch('(c)');

  return 'end of thread 1';
}).then(
  function (val) { console.info('ok: ' + val); },
  function (err) { console.error('ng: ' + err); });

// *** SECOND THREAD ***
co(function*() {
  // receive
  var a = yield ch;

  // send sync
  yield ch('(b)');

  // receive
  var c = yield ch;

  console.log(a + c);
  return 'end of thread 2';
}).then(
  function (val) { console.info('ok: ' + val); },
  function (err) { console.error('ng: ' + err); });
