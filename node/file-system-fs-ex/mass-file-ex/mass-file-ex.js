// mass-file-ex.js

(function () {
  'use strict';

  var fs = require('fs');

  var x = Date.now();
  var b = new Buffer(1024 * 1024); // 1MB
  var w = fs.openSync('size-500mb.log', 'w', parseInt('666', 8));

  for (var i = 0; i < 500; ++i)
    fs.writeSync(w, b, 0, b.length);
  fs.closeSync(w);

  console.log((Date.now() - x)/1000.0);

})();
