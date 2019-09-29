void function () {
	'use struct';

	function PromiseSingleThunk(setup) {
		if (!(this instanceof PromiseSingleThunk))
			throw new Error('new required');

		if (typeof setup !== 'function')
			throw new TypeError('setup must be a function');

		var p = new Promise(setup);
		thunk.then = p.then.bind(p);
		thunk['catch'] = p['catch'].bind(p);
		return thunk;

		function thunk(cb) {
			p.then(
				function (val) { cb(null, val); },
				function (err) { cb(err); });
		}
	}

	function wait(ms, val) {
		console.log('wait', ms, val);
		return new PromiseSingleThunk(res => setTimeout(res, ms, val));
	}

	wait(100, 'x')
	((err, val) => err ? err : wait(100, 'y'));

	wait(500, 'a')
	.then(val => wait(500, 'b'))
	.then(val => wait(500, 'c'))
	.then(val => wait(500, 'd'))
	.catch(err => console.error(err));

} ();
