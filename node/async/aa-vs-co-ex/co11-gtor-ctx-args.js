var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co.call({ctx: 'ctx'}, function* (arg1, arg2) {
	var result = yield Promise.resolve(true);
	return [result, arg1, arg2, this];
}, 123, 'abc'));
