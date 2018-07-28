// Callbacks vs Coroutines
// A look ad callbacks vs generators vs coroutines
// https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127

// co@4 : Promise version

module.exports = co4;

function co4(fn) {
	return new Promise((resolve, reject) => {
		try {
			var gen = fn();
			next();
		} catch (err) { reject(err); }
		function next(val) {
			try {
				var ret = gen.next(val);
				console.dir(ret);
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
