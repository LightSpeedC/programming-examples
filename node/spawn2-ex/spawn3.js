void function () {
	'use strict';

	module.exports = spawn;

	function spawn(gfn) {
		if (isGeneratorFunction(gfn)) gfn = gfn();
		return function thunk(callback) {
			if (gfn && typeof gfn.then === 'function')
				return gfn.then(function (v) { callback(null, v); }, callback);
			var gen, gtors = [gfn];

			next(null);

			function next(err, val) {
				for (;;) {
					if (gtors.length === 0)
						return callback && callback(err, val);
					gen = gtors[gtors.length - 1];
					if (typeof gen.next !== 'function' ||
						typeof gen['throw'] !== 'function')
						return reject(new Error('is not generator'));
					for (;;) {
						try {
							val = err ? gen['throw'](err) : gen.next(val);
							err = null;
							var done = val.done;
							val = val.value;
							if (done) { gtors.pop(); break; }
							switch (typeof val) {
								case 'function':
									if (isGeneratorFunction(val)) {
										gtors.push(gen = val());
										val = null;
									}
									else return val(next);
									continue;
								case 'object':
									if (val) {
										if (typeof val.then === 'function')
											return val.then(function (v) { next(null, v); }, next);
										else if (typeof val.next === 'function') {
											gtors.push(gen = val);
											val = null;
										}
										else if (val.constructor === Array && val.length > 0)
											return arrcb(val, next);
										else if (val.constructor === Object)
											return objcb(val, next);
									}
								default:
									continue;
							} // switch
						} catch (e) { gtors.pop(); err = e; val = undefined; break; }
					}
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

	function isGeneratorFunction(gtor) {
		if (!gtor) return false;
		return (gtor.constructor.displayName || gtor.constructor.name) === 'GeneratorFunction';
	}

} ();
