'use strict';

var get = require('./get');

function co_get(file) {
  return function (callback) {
    get(file, callback);
  };
}

// var thunkify = require('thunkify');
// var co_get = thunkify(get);

module.exports = co_get;
