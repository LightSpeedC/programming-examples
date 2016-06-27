void function () {
	'use strict';

	module.exports = spawn;

	function spawn(gfn) {
		if (gfn && typeof gfn.then === 'function') return gfn;
		if (isGeneratorFunction(gfn)) gfn = gfn();
		return function thunk(callback) {
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
							if (val == null ||
								typeof val === 'string' ||
								typeof val === 'number' ||
								typeof val === 'boolean') continue;
							else if (typeof val === 'function') {
								if (isGeneratorFunction(val))
									{ gtors.push(gen = val()); val = null; }
								else return val(next);
							}
							else if (typeof val.then === 'function')
								return val.then(function (v) { next(null, v); }, next);
							else if (typeof val.next === 'function')
								{ gtors.push(gen = val); val = null; }
						} catch (e) { gtors.pop(); err = e; val = undefined; break; }
					}
				} // for
			} // next
		}; // thunk
	} // spawn

	function isGeneratorFunction(gtor) {
		if (!gtor) return false;
		return (gtor.constructor.displayName || gtor.constructor.name) === 'GeneratorFunction';
	}

} ();
