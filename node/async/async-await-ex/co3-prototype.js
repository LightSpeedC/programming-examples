// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version

var fs = require('fs');

co3(function *() {
	console.log(yield read('README.md'));
	yield delay(1000);
	console.log(yield read('package.json'));
})();

function co3(fn) {
	return cb => {
		var gen = fn();
		next();
		function next(err, val) {
			var ret = gen.next(val);
			if (ret.done) return cb && cb(ret.value);
			ret.value(next);
		}
	};
}

function read(file) {
	return cb => fs.readFile(file, 'utf8', cb);
}

function delay(ms) {
	return cb => setTimeout(cb, ms);
}
