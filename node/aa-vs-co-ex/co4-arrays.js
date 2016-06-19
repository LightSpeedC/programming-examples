var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co(function* () {
  var res = yield [
    Promise.resolve(1),
    Promise.resolve(2),
    Promise.resolve(3),
  ];
  console.log(res); // => [1, 2, 3] 
}));

function delay(ms, val) {
  return function (cb) { setTimeout(cb, ms, null, val); };
}

next(co(function* () {
	yield delay(100);
	var res = yield [delay(200, 'x'), delay(100, 'y'), delay(300, 'z')];
	console.log(res); // => ['x', 'y', 'z'] 
}));
