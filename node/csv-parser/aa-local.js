// csv-parser

'use strict';

// ES6, error, thunk, promise, yield + return : thunk
const aa = gtor => {
	if (typeof gtor === 'function') gtor = gtor();
	let end = false;
	return last => function cb(err, val) {
		try {
			val = arguments.length === 1 ? err : val;
			if (end && err instanceof Error) return last && last(err);

			if (typeof val === 'function') return val(cb);
			else if (val && typeof val.then === 'function')
				return val.then(val => cb(null, val), cb);

			const {done, value} = end ? {done: true, value: val} :
				err instanceof Error ? gtor.throw(err) :
				gtor.next(val);
			if (done) end = true;

			typeof value === 'function' ? value(cb) :
			value && typeof value.then === 'function' ?
				value.then(val => cb(null, val), cb) :
			done ? last && last(null, value) :
			cb(null, value);
		} catch (err) { last && last(err); }
	} ();
};

aa.sleep = (ms, val) => cb =>
	ms >= 0 ?
		setTimeout(cb, ms, null, val) :
		setTimeout(cb, 0, new Error('err: ' + val));

module.exports = aa;
