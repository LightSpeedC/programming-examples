(function (Thunk) {
	'use strict';

	(typeof commonMakeSync === 'function' ? commonMakeSync : require('./common-make-sync'))(Thunk);
	(typeof commonMethods === 'function' ? commonMethods : require('./common-methods'))(Thunk);
	(typeof commonAa === 'function' ? commonAa : require('./common-aa'))(Thunk);

	var aa = Thunk.aa;
	var wait = Thunk.wait;
	var makeSync = Thunk.makeSync;

	function now() {
		return new Date().toLocaleTimeString();
	}

	console.log(now(), '0000');
	aa(function *() {

		console.log(now(), '1111');
		var sync = makeSync(2);
		console.log(now(), '2222');

		var result = yield {
			a: aa(function *() {
				console.log(now(), 'proc1.0');
				console.log(now(), yield wait(2000, 'proc1.1 wait'), now());
				//console.log(now(), yield sync(wait(2000, 'proc1 wait')), now());
				console.log(now(), 'proc1.2');
				console.log(now(), 'proc1.3', yield sync(), now());
				return 'proc1';
			}),
			b: aa(function *() {
				console.log(now(), 'proc2.0');
				console.log(now(), yield wait(4000, 'proc2.1 wait'), now());
				//console.log(now(), yield sync(wait(4000, 'proc2 wait')), now());
				console.log(now(), 'proc2.2');
				console.log(now(), 'proc2.3', yield sync(), now());
				return 'proc2';
			})
		};
		console.log(now(), result);
		console.log(now(), '3333');

	}).then(
		val => console.log(now(), 'end', val),
		err => console.log(now(), 'err', err));

//})(typeof Thunk === 'function' ? Thunk : require('./common-thunk'));
})(Dummy);

function Dummy(setup, cb) {
	if (typeof cb === 'function')
		return new Promise(setup).then(val => cb(null, val), cb);

	return new Promise(setup);
}
