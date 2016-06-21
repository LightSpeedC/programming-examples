void function () {
	'use struct';

	function delay1(ms, val) {
		console.log('delay1', ms, val);
		return cb => setTimeout(cb, ms, null, val);
	}

	function delay(ms, val) {
		console.log('delay', ms, val);
		return Thunk(cb => setTimeout(cb, ms, null, val));
	}

	function Thunk(setup) {
		var callback, next, args, ctx = this;
		try { setup(cb); } catch (e) { cb(e); }
		return thunk;
		function thunk(cb1) {
			callback = cb1;
			args && setImmediate(fire);
			return Thunk(cb => next = cb);
		}
		function cb() {
			args = arguments;
			callback && setImmediate(fire);
		}
		function fire() {
			try {
				var r = callback.apply(ctx, args);
				if (typeof r === 'function') r(next);
				else if (r && r.then) r.then(v => next(null, v), e => next(e));
				else if (r instanceof Error) next(r);
				else next(null, r);
			} catch (e) { next(e); }
		}
	}

	delay1(3500, 'a')
	((err, val) => err ? err : delay1(500, 'b'))
	//((err, val) => err ? err : delay(500, 'c'))
	//((err, val) => err ? err : delay(500, 'd'))
	//((err, val) => err ? console.error(err) : null);

	delay(500, 'a')
	((err, val) => err ? err : delay(500, 'b'))
	((err, val) => err ? err : delay(500, 'c'))
	((err, val) => err ? err : delay(500, 'd'))
	((err, val) => err ? console.error(err) : null);

} ();
