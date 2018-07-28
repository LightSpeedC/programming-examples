'use strict';

var get = require('./get');

get('a.txt', function (err, a) {
  get('b.txt', function (err, b) {
    get('c.txt', function (err, c) {
      console.log(a + b + c);
    });
  });
});
