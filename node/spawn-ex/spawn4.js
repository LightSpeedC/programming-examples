void function () {
	'use strict';

	module.exports = spawn;

	function spawn(gfn) {
		if (gfn && typeof gfn.then === 'function') return gfn;
		if (isGeneratorFunction(gfn)) gfn = gfn();
		return new Promise(function (resolve, reject) {
			var gen, gtors = [gfn];
			next(null);
			function next(err, val) {
				for (;;) {
					if (gtors.length === 0)
						return err ? reject(err) : resolve(val);
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
						} catch (e) { gtors.pop(); err = e; break; }
					}
				} // for
			} // next
		}); // Promise
	} // spawn

	function isGeneratorFunction(gtor) {
		if (!gtor) return false;
		return (gtor.constructor.displayName || gtor.constructor.name) === 'GeneratorFunction';
	}

	if (require.main === module) {
		var r = spawn(function *() {
			console.log('*', undefined, yield undefined);
			console.log('*', null, yield null);
			console.log('*', 0, yield 0);
			console.log('*', 1, yield 1);
			console.log('*', 2, yield Promise.resolve(2));
			try { yield Promise.reject(new Error('2'));
			} catch (e) { console.log('*', 2, e + ''); }
			console.log('*', 3, yield function (cb) { setTimeout(cb, 300, null, 3); });
			try { yield function (cb) { setTimeout(cb, 300, new Error('3')); };
			} catch (e) { console.log('*', 3, e + ''); }
			console.log('*', 4, yield function *() { yield 44; return 4; });
			try { yield function *() { throw new Error('4'); };
			} catch (e) { console.log('*', 4, e + ''); }
			console.log('*', 5, yield function *() { yield 55; return 5; } ());
			try { yield function *() { throw new Error('5'); } ();
			} catch (e) { console.log('*', 5, e + ''); }
			console.log('*', 9, yield 9);
			throw new Error('x');
			return 'end';
		});
		if (r && r.then) r.then(
			function (v) { console.log('v', v); },
			function (e) { console.log('e', e + ''); });
		else if (typeof r === 'function') r(function (e, v) { console.log('ev', e + '', v); });
	}

} ();
