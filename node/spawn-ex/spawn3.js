void function () {
	'use strict';

	module.exports = spawn;

	function spawn(val) {

		return function thunk(callback) {

			if (isGeneratorFunction(val)) val = val();

			var gtors = [];

			if (val === undefined || val === null ||
				typeof val === 'string' ||
				typeof val === 'number' ||
				typeof val === 'boolean')
				return callback && callback(null, val);

			if (typeof val === 'function')
				return val(next);

			if (typeof val.then === 'function')
				return val.then(nextval, next);

			if (typeof val.next !== 'function')
				return callback && callback(null, val);

			gtors = [val];

			next(null);

			function nextval(val) { next(null, val); }

			function next(err, val) {

				for (;;) {
					if (gtors.length === 0)
						return callback && callback(err, val);

					var gen = gtors[gtors.length - 1];

					if (typeof gen.next !== 'function' ||
						typeof gen['throw'] !== 'function')
						return callback && callback(new Error('is not generator'));

					for (;;) {
						try {
							val = err ? gen['throw'](err) : gen.next(val);
							err = null;
							var done = val.done;
							val = val.value;
							if (done) { gtors.pop(); break; }

							if (val === undefined || val === null) continue;

							if (typeof val === 'function') {
								if (!isGeneratorFunction(val)) return val(next);
								gtors.push(gen = val()), val = null;
							}
							else if (typeof val === 'object') {
								if (typeof val.then === 'function')
									return val.then(nextval, next);
								else if (typeof val.next === 'function')
									gtors.push(gen = val), val = null;
								else if (val.constructor === Array && val.length > 0)
									return arrcb(val, next);
								else if (val.constructor === Object)
									return objcb(val, next);
							}

						} catch (e) { gtors.pop(); err = e; val = undefined; break; }
					} // for
				} // for
			} // next

			function arrcb(arr, next) {
				if (arr.length === 0) return next(null, []);
				var ret = new Array(arr.length), n = 0;
				arr.forEach(function (val, i) {
					++n;
					function cb(e, v) {
						if (n <= 0) return;
						if (e) return n = 0, next(e);
						ret[i] = v;
						if (--n === 0) next(null, ret);
					}
					switch (typeof val) {
						case 'function':
							if (isGeneratorFunction(val))
								return spawn(val())(cb);
							else return val(cb);
						case 'object':
							if (val) {
								if (typeof val.then === 'function')
									return val.then(function (v) { cb(null, v); }, cb);
								else if (typeof val.next === 'function')
									return spawn(val)(cb);
								else if (val.constructor === Array && val.length > 0)
									return arrcb(val, cb);
								else if (val.constructor === Object)
									return objcb(val, cb);
							}
						default:
							return cb(null, val);
					} // switch
				}); // forEach
			} // arrcb

			function objcb(obj, next) {
				var arr = Object.keys(obj);
				if (arr.length === 0) return next(null, {});
				var ret = {}, n = 0;
				arr.forEach(function (i) {
					var val = obj[i];
					ret[i] = undefined;
					++n;
					function cb(e, v) {
						if (n <= 0) return;
						if (e) return n = 0, next(e);
						ret[i] = v;
						if (--n === 0) next(null, ret);
					}
					switch (typeof val) {
						case 'function':
							if (isGeneratorFunction(val))
								return spawn(val())(cb);
							else return val(cb);
						case 'object':
							if (val) {
								if (typeof val.then === 'function')
									return val.then(function (v) { cb(null, v); }, cb);
								else if (typeof val.next === 'function')
									return spawn(val)(cb);
								else if (val.constructor === Array && val.length > 0)
									return arrcb(val, cb);
								else if (val.constructor === Object)
									return objcb(val, cb);
							}
						default:
							return cb(null, val);
					} // switch
				}); // forEach
			} // objcb

		}; // thunk
	} // spawn

	function isGeneratorFunction(gfn) {
		if (typeof gfn !== 'function') return false;
		return (gfn.constructor.displayName || gfn.constructor.name) === 'GeneratorFunction';
	}

} ();
