// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@4 : Promise version

var fs = require('fs');

co4(function *() {
	console.log(yield read('README.md'));
	yield wait(1000);
	console.log(yield read('package.json'));
});

function co4(fn) {
	return new Promise((resolve, reject) => {
		try {
			var gen = fn();
			next();
		} catch (err) { reject(err); }
		function next(val) {
			try {
				var ret = gen.next(val);
				if (ret.done) return resolve(ret.value);
				ret.value.then(next, error);
			} catch (err) { reject(err); }
		}
		function error(err) {
			try { gen.throw(err); }
			catch (err) { reject(err); }
		}
	});
}

function read(path) {
	return new Promise(resolve => fs.readFile(path, 'utf8', (err, val) => resolve(val)));
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
