var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co(function *() {

	console.log('\nundefined');
	yield next(co());

	console.log('\nnull');
	yield next(co(null));

}));
