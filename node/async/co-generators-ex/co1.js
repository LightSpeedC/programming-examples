(function () {
  'use strict';

  var fs = require('fs');

  function co1(fn) {
    var gen = fn();

    function next(err, res) {
      var ret = gen.next(res);
      if (ret.done) return;
      ret.value(next);
    }

    next();
  }

  co1(function *(){
    var str = yield read('README.md');
    var buf = yield read('package.json');
    yield write('README.md.log', str);
    yield write('package.json.log', buf);
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
