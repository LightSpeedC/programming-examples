'use strict';

var get = require('./get');

var n = 0;
var res = {};

++n;
get('a.txt', function (err, a) {
  res.a = a;
  if (--n === 0) callback(null, res);
});

++n;
get('b.txt', function (err, b) {
  res.b = b;
  if (--n === 0) callback(null, res);
});

++n;
get('c.txt', function (err, c) {
  res.c = c;
  if (--n === 0) callback(null, res);
});

function callback(err, res) {
  console.log(res.a + res.b + res.c);
}
