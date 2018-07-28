(function () {
  'use strict';

  var fs = require('fs');

  function readAsync(path, fn) {
    fs.readFile(path, 'utf8', fn);
  }

  function writeAsync(path, str, fn) {
    fs.writeFile(path, str, fn);
  }

  function readAndWriteAsync(fn) {
    readAsync('README.md', function(err, str){
      if (err) return fn(err);
      str = str.replace('Something', 'Else');
      writeAsync('README.md.log', str, fn);
    });
  }

  readAndWriteAsync(function(err) { console.log('finished:', err); });

})();
