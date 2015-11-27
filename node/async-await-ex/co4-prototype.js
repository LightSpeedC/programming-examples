// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@4 : Promise version

var fs = require('fs');

thread(function *(){
	console.log(yield read('README.md'));
	yield wait(1000);
	console.log(yield read('package.json'));
});

function thread(fn) {
	var gen = fn();
	next();
	function next(val) {
		var ret = gen.next(val);
		if (ret.done) return;
		ret.value.then(next, error);
	}
	function error(err) {
		gen.throw(err);
	}
}

function read(path) {
	return new Promise(resolve => fs.readFile(path, 'utf8', (err, val) => resolve(val)));
}

function wait(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}
