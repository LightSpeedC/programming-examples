(function () {
  'use strict';

  var fs = require('fs');

  function co2(fn) {
    var gen = fn();

    function next(err, res) {
      var ret = gen.next(res);
      if (ret.done) return;
      ret.value(next);
    }

    next();
  }

  co2(function *(){
    var str = yield read('README.md');
    str = str.replace('Something', 'Else');
    yield write('README.md.log', str);
  });

  function read(path) {
    return function(done){
      fs.readFile(path, 'utf8', done);
    }
  }

  function write(path, str) {
    return function(done){
      fs.writeFile(path, str, done);
    }
  }

})();
