void function () {
	'use struct';

	const Thunk = require('new-thunk');

	function delay(ms, val) {
		console.log('delay', ms, val);
		return new Thunk(cb => setTimeout(cb, ms, null, val));
	}

	delay(500, 'a')
	((err, val) => err ? err : delay(500, 'b'))
	((err, val) => err ? err : delay(500, 'c'))
	((err, val) => err ? err : delay(500, 'd'))
	((err, val) => err ? console.error(err) : null);

} ();
