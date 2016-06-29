// Generated by CoffeeScript 1.10.0
(function() {
  var co, run;

  co = require('./co4');

  run = function*(func) {
    var d, i, j, t, ts, x, y;
    ts = [];
    for (i = j = 1; j <= 2000; i = ++j) {
      ts.push(Date.now());
      (yield new Promise(func));
    }
    x = 0;
    y = 0;
    for (i in ts) {
      t = ts[i];
      if (i > 0) {
        d = ts[i] - ts[i - 1];
        y = y + d;
        if (d === 0) {
          x = x + 1;
        }
      }
    }
    return console.log(x, y / 2000);
  };

  co(function*() {
    (yield run(function(r) {
      return setTimeout(r, 0);
    }));
    (yield run(function(r) {
      return setTimeout(r, 1);
    }));
    (yield run(function(r) {
      return setTimeout(r, 2);
    }));
    (yield run(function(r) {
      return process.nextTick(r);
    }));
    return (yield run(function(r) {
      return setImmediate(r);
    }));
  });

}).call(this);
