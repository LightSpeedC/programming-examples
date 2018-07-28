void function () {
	'use strict';

	var aa = require('./aa021');

	var o = function *() {
		yield 1;
		return 11;
	} ();
	console.log(o);
	console.log(o.next);
	console.log(o.constructor);
	console.log(o.constructor.name);

	aa(function *() {

		yield aa(function *() {
			yield 1;
			return 11;
		})(function (e, v) { console.log('e1:', e + ',', 'v:', v); });

		yield aa(function *() {
			yield 1;
			return 11;
		} ())(function (e, v) { console.log('e2:', e + ',', 'v:', v); });

	});

} ();
