/* nkf32_test.js */

(function () { 'use strict';

/**
 * 日本語漢字変換のテスト
 */

var nkf32 = require('nkf32');

var execCnt = 0;
var execMax = 0;

for (var i = 1000; i < 1200; ++i) {
  nkf32('nkf32.txt', 'nkf32_utf8_' + i + '.txt', ['-w'], 
    (function (i) { return function (err) {
      --execCnt;
      if (err) throw err;
      nkf32('nkf32_utf8_' + i + '.txt', 'nkf32_sjis_' + i + '.txt', ['-s'], function (err) {
        --execCnt;
        if (err) throw err;
        //console.log('end '+i);
        if (execCnt == 0)
          console.log('max=' + execMax);
      });
      ++execCnt;
      if (execMax < execCnt) execMax = execCnt;
    }})(i)
  );
  ++execCnt;
  if (execMax < execCnt) execMax = execCnt;
}

})();
