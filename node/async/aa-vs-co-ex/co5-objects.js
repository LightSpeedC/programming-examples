var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co(function* () {
	var res = yield {
		1: Promise.resolve(1),
		2: Promise.resolve(2),
	};
	console.log(res); // => { 1: 1, 2: 2 } 
}));
