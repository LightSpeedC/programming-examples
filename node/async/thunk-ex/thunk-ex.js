void function () {
	'use struct';

	const Thunk = require('new-thunk');

	function sleep(ms, val, cb) {
		setTimeout(ms, cb, null, val);
	}

	function wait(ms, val) {
		console.log('wait', ms, val);
		return new Promise(res => setTimeout(res, ms, val));
	}

	function delay(ms, val) {
		console.log('delay', ms, val);
		return new Thunk(cb => setTimeout(cb, ms, null, val));
	}

	wait(3500, 'a')
	.then(val => wait(500, 'b'))
	.then(val => wait(500, 'c'))
	.then(val => wait(500, 'd'))
	.catch(err => console.error(err));

	delay(500, 'a')
	((err, val) => err ? err : delay(500, 'b'))
	((err, val) => err ? err : delay(500, 'c'))
	((err, val) => err ? err : delay(500, 'd'))
	((err, val) => err ? console.error(err) : null);

} ();
