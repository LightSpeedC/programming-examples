// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version

var fs = require('fs');

thread(function *(){
	console.log(yield read('README.md'));
	yield delay(1000);
	console.log(yield read('package.json'));
});

function thread(fn) {
	var gen = fn();
	next();
	function next(err, val) {
		var ret = gen.next(val);
		if (ret.done) return;
		ret.value(next);
	}
}

function read(file) {
	return done => fs.readFile(file, 'utf8', done);
}

function delay(ms) {
	return done => setTimeout(done, ms);
}
