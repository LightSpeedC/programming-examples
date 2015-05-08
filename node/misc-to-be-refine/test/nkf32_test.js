/* nkf32_test.js */

(function () { 'use strict';

/**
 * 日本語漢字変換のテスト
 */

var nkf32 = require('nkf32');

nkf32('nkf32.txt', 'nkf32_utf8.txt', ['-S', '-w'], function (err) {
  if (err) throw err;
  nkf32('nkf32_utf8.txt', 'nkf32_sjis.txt', ['-W', '-s'], function (err) {
    if (err) throw err;
    console.log('end');
  });
});

})();
