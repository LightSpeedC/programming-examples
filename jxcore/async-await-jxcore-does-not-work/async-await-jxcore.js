// async-await-jxcore.js

void function () {
	'use strict';

	function timer(ms) {
		return function (cb) {
			setTimeout(cb, ms);
		}
	}

	var aa = require('aa');
	aa(function *() {
		var i = 0;
		console.log('a', ++i);
		yield timer(100);
		console.log('a', ++i);
		yield timer(100);
		console.log('a', ++i);
		yield timer(100);
		console.log('a', ++i);
	});
}();
