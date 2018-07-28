void function () {
	'use strict';

	module.exports = next;

	const util = require('util');

	let i = 0;

	function next(p) {
		++i;
		let j = i;
		if (p && typeof p.then === 'function') {
			if (typeof p === 'function')
				console.log('(' + j + ') promise-thunk!');
			else
				console.log('(' + j + ') promise!');
			return p.then(resolved, rejected);
		}
		else if (p && typeof p.next === 'function') {
			console.log('(' + j + ') generator!');
			for (let x of p)
				console.log('(' + j + ') ' + inspect(x));
			return p;
		}
		else if (typeof p === 'function') {
			console.log('(' + j + ') thunk!');
			return p(callback);
		}
		else {
			console.log('(' + j + ') other value! type:', typeof p,
				inspect(p));
		}

		function resolved(val) { console.log('(' + j + ') val:', val); }
		function rejected(err) { console.error('(' + j + ') err:', err.stack); }
		function callback(err, val) { err ? rejected(err) : resolved(val); }
	}

	function inspect(x) {
		return util.inspect(x, {depth: null, colors: true});
	}

}();
