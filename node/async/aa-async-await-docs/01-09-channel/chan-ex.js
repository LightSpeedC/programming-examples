'use strict';

module.exports = Channel;

function Channel() {
	const cbs = [], vals = [];
	chan.then = then;
	return chan;

	function chan(first) {
		if (typeof first === 'function') cbs.push(first);
		else vals.push(arguments);
		while (cbs.length > 0 && vals.length > 0) {
			try { cbs.shift().apply(null, vals.shift()); }
			catch (err) { vals.push([err]); }
		}
		return chan;
	}
}


function then(resolved, rejected) {
	return this(function (err, val) {
		if (err) rejected && rejected(err);
		else resolved && resolved(val);
	});
}
