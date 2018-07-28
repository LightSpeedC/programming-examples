// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@3 : thunk version

module.exports = co3;

function co3(fn) {
	return cb => {
		var gen = fn();
		next();
		function next(err, val) {
			var ret = gen.next(val);
			console.dir(ret);
			if (ret.done) return cb && cb(ret.value);
			ret.value(next);
		}
	};
}
