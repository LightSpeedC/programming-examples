'use strict';

var get = require('./get');

function co_get(file) {
  return new Promise(function (resolve, reject) {
    get(file, function (err, value) {
      if (err) reject(err);
      else resolve(value);
    });
  });
}

module.exports = co_get;
