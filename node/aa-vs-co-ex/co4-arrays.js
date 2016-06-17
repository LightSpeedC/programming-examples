var co = require(process.argv[2] || 'co');

co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ];
  console.log(res); // => [1, 2, 3] 
}).catch(function (err) {
  console.error(err.stack);
});

function delay(ms, val) {
  return function (cb) { setTimeout(cb, ms, null, val); };
}

co(function* () {
  var res = yield [delay(200, 'x'), delay(100, 'y'), delay(300, 'z')];
  console.log(res); // => ['x', 'y', 'z'] 
}).catch(function (err) {
  console.error(err.stack);
});
