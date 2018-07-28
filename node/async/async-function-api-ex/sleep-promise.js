// sleep([opts,] msec, [val], [cb])

	'use strict';

	const promiseThunkCallback = require('./promise-thunk-callback');

	function sleep(opts, msec, val, cb) {
		var i = 0, a = arguments, n = arguments.length;
		cb = typeof a[n - 1] === 'function' ? a[--n] : promiseThunkCallback();
		opts = i < n && typeof a[i] === 'object' && a[i++] || {};
		msec = i < n ? a[i++] : undefined;
		val  = i < n ? a[i++] : undefined;

		if (!(msec >= 0)) throw new TypeError('number msec must specify');

		setTimeout(cb, msec, null, val);
		return cb.promiseThunk;
	}


	var delay = sleep;
	var wait = sleep;

	sleep(1000, 'cb',
		(err, val) => console.log('sleep1', err, val));
	delay(1000, 'thunk')
		((err, val) => console.log('delay1', err, val));
	wait(1000, 'promise')
		.then(val => console.log('wait-1', val),
			err => console.log('wait1e', err));
	wait(1500, 'promise')
		.then(val => console.log('wait15', val))
		.catch(err => console.log('wait15e', err));
	sleep(1600, () => console.log());

	sleep(2000,
		(err, val) => console.log('sleep2', err, val));
	delay(2000)
		((err, val) => console.log('delay2', err, val));
	wait(2000)
		.then(val => console.log('wait-2', val),
			err => console.log('wait2e', err));
	wait(2500)
		.then(val => console.log('wait25', val))
		.catch(err => console.log('wait25e', err));
	sleep(2600, () => console.log());

	sleep({}, 3000,
		(err, val) => console.log('sleep3', err, val));
	delay({}, 3000)
		((err, val) => console.log('delay3', err, val));
	wait({}, 3000)
		.then(val => console.log('wait-3', val),
			err => console.log('wait3e', err));
	wait({}, 3500)
		.then(val => console.log('wait35', val))
		.catch(err => console.log('wait35e', err));
	sleep(3600, () => console.log());

//	delay({}, 4000)
//		((err, val) => (console.log('delay4', err, val), delay({}, 500)))
//		((err, val) => console.log('delay5', err, val))
//		.then(val => console.log('wait65', val))
//		.catch(err => console.log('wait65e', err));
