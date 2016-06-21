void function () {
	'use struct';

	function wait(ms, val) {
		console.log('wait', ms, val);
		return new Promise(res => setTimeout(res, ms, val));
	}

	wait(500, 'a')
	.then(val => wait(500, 'b'))
	.then(val => wait(500, 'c'))
	.then(val => wait(500, 'd'))
	.catch(err => console.error(err));

} ();
