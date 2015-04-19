'use strict';

function get(file, callback) {
  console.log('file: %s...', file);
  setTimeout(function () {
    console.log('file: %s complete', file);
    callback(null, '(' + file + ')');
  }, 200 + Math.random() * 100);
}

module.exports = get;
