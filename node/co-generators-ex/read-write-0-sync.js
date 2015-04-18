(function () {
  'use strict';

  var fs = require('fs');

  function readSync(path) {
    return fs.readFileSync(path, 'utf8');
  }

  function writeSync(path, str) {
    fs.writeFileSync(path, str);
  }

  function readAndWriteSync() {
    try {
      var str = readSync('README.md');
    } catch (err) {
      // whatever
      console.log('read err', err);
    }
    str = str.replace('Something', 'Else');
    writeSync('README.md.log', str);
    console.log('all done!');
  }

  readAndWriteSync();

})();
