var co = require(process.argv[2] || 'co');
var next = require('./next');

next(co(function *() {

	yield co(function *() {
		// yield any promise 
		var result = yield Promise.resolve(true);
		console.log(result);
	});

	yield co(function *(){
		// resolve multiple promises in parallel 
		var a = Promise.resolve(1);
		var b = Promise.resolve(2);
		var c = Promise.resolve(3);
		var res = yield [a, b, c];
		console.log(res);
		// => [1, 2, 3] 
	});

	// errors can be try/catched 
	yield co(function *(){
		try {
			yield Promise.reject(new Error('boom'));
		} catch (err) {
			console.error(err.message); // "boom" 
		}
	});

}));
