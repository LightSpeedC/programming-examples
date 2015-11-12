(function (Promise) {
	'use strict';

	var PromiseCore = require('./promise-core');

	if (!Promise) Promise = PromiseCore;

	// sleep
	function sleep(ms, val) {
		return new PromiseCore(function (resolve, reject) {
			setTimeout(resolve, ms, val);
		});
	}

	if (typeof sleep(0, 'test') === 'function') {
		console.log('thunkified promise ***************************************************************');
		sleep(1000, 'a')
		((e, v) => {console.log(e ? 'a error: ' + e : v); throw new Error('xxx'); return sleep(1000, 'b'); })
		((e, v) => {console.log(e ? 'b error: ' + e : v); return e ? e : sleep(1000, 'c'); })
		((e, v) => console.log(e ? 'catch all: ' + e : v));
	}
	else {
		sleep(1000, 'a')
		.then((v) => {console.log(v); return sleep(1000, 'b'); })
		.then((v) => {console.log(v); throw new Error('xxx'); return sleep(1000, 'c'); })
		.then(console.log)
		.catch((e) => console.log('catch all: ' + e));
	}

	console.log(sleep(1000, 'a'));
	console.log('pending: %s', sleep(1000, 'a'));
	console.log('pending: %j', sleep(1000, 'a'));
	console.log('resolve: %s', PromiseCore.resolve(1));
	console.log('resolve: %j', PromiseCore.resolve(1));
	console.log('reject: %s', PromiseCore.reject(new Error('yyy')));
	console.log('reject: %j', PromiseCore.reject(new Error('zzz')));
	console.log('prototype? %s', PromiseCore.resolve(1).constructor.prototype);
	console.log('prototype? %j', PromiseCore.resolve(1).constructor.prototype);
	console.log('prototype?', PromiseCore.resolve(1).constructor.prototype);

})(typeof Promise === 'function' ? Promise : null);
