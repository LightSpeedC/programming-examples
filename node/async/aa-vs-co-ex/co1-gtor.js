var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co(function* () {
	var result = yield Promise.resolve(true);
	return result;
}));
