(function (Thunk) {
	'use strict';

	const wait = (msec, val) => cb => setTimeout(cb, msec, null, val);

	Thunk.aa(function *() {
		console.log('main1');
	});

})(typeof Thunk === 'function' ? Thunk : require('./thunk'));
