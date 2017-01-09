'use strict';

const sleep = (ms, val) => cb =>
	ms >= 0 ?
		setTimeout(cb, ms, null, val) :
		setTimeout(cb, 0, new Error('err: ' + val));
/*
function sleep(ms, val) {
	return function (cb) {
		ms >= 0 ?
			setTimeout(cb, ms, null, val) :
			setTimeout(cb, 0, new Error('err: ' + val));
	};
}
*/

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

/*
// ES6, error, thunk, promise : thunk
const aa = gtor => last => function cb(err, val) {
	try {
		const {done, value} = err instanceof Error ?
			gtor.throw(err) :
			gtor.next(arguments.length === 1 ? err : val);
		typeof value === 'function' ? value(cb) :
		value && typeof value.then === 'function' ? value.then(cb, cb) :
		done ? last && last(null, value) :
		cb(null, value);
	} catch (err) { last && last(err); }
} ();
*/

/*
// ES6 thunk : thunk
const aa = gtor => last => function cb(err, val) {
	const {done, value} = gtor.next(val);
	done ? last(null, value) :
	typeof value === 'function' ? value(cb) :
	//value && typeof value.then === 'function' ?
	//	value.then(val => cb(null, val), cb) :
	cb(null, value);
} ();
*/

/*
// ES6, error, thunk, promise : thunk
const aa = gtor => last => function cb(err, val) {
	try {
		var obj = err instanceof Error ? gtor.throw(err) :
			gtor.next(arguments.length === 1 ? err : val);
		val = obj.value;
		obj.done ? last && last(null, val) :
		typeof val === 'function' ? val(cb) :
		val && typeof val.then === 'function' ?
			val.then(val => cb(null, val), cb) :
		cb(null, val);
	} catch (err) { last && last(err); }
} ();
*/

/*
// ES5, error, thunk, promise : thunk
function aa(gtor) {
	return function (last) {
		return function cb(err, val) {
			try {
				var obj = err instanceof Error ?
					gtor.throw(err) :
					gtor.next(arguments.length === 1 ? err : val);
				val = obj.value;
				obj.done ? last && last(null, val) :
				typeof val === 'function' ? val(cb) :
				val && typeof val.then === 'function' ?
					val.then(val => cb(null, val), cb) :
				cb(null, val);
			} catch (err) { last && last(err); }
		} ();
	};
}
*/

aa(function *main() {
	console.log('111');
	yield sleep(500, sleep(500, 11));
	console.log('222');
	yield sleep(500, sleep(500, 22));
	console.log('333');
	return sleep(500, sleep(500, 44));
}) ((err, val) => console.log('end', err || val));
//} ()) ();
