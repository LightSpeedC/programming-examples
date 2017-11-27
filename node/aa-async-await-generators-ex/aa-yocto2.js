'use strict';

const F = 'function', N = 'number', B = 'boolean', S = 'string', O = 'object';

aa.Channel = Channel;
aa.wait = wait;

// aa - async await
function aa(g) {
	// no arguments -> Channel
	if (arguments.length === 0)
		return Channel();

	// undefined | null | boolean | string | number -> Promise it
	if (typeof g === B || typeof g === S || typeof g === N || !g)
		return Promise.resolve(g);

	// thenable or is Promise -> it
	if (typeof g.then === F)
		return g;

	// stream -> consume it
	if (typeof g.on === F)
		return new Promise(function (res, rej) {
			const result = [];
			g.on('error', rej);
			g.on('end', function (data) {
				if (data) result.push(data);
				res(result);
			});
			g.on('data', function (data) {
				result.push(data);
			});
		});

	// Array -> Promise all
	if (g.constructor === Array)
		return Promise.all(g.map(aa));

	// Object -> Promise all
	if (g.constructor === Object) {
		const keys = Object.keys(g);
		return Promise.all(keys.map(function (key) { return aa(g[key]); }))
			.then(function (arr) {
				return arr.reduce(function (obj, val, i) {
					obj[keys[i]] = val;
					return obj;
				}, {});
			});
	}

	// function (thunk, generator function, async function) or generator -> do it
	if (typeof g === F || typeof g.next === F)
		return new Promise(function (res, rej) {
			if (typeof g === F) g = g(normalizeCallback(function (err, val) {
				return err ? rej(err) : res(val);
			}));

			const cb = normalizeCallback(function cb2(err, val) {
				try {
					val = err ? g.throw(err) : g.next(val);
					val.done ? aa(val.value).then(res, rej) :
						(typeof val.value === N ? aa.wait(val.value) : aa(val.value))
							.then(function (val) { return cb(null, val); }, cb2);
				} catch (err) { rej(err); }
			});
			if (g && typeof g.next === F) cb();
			else if (g && typeof g.then === F) g.then(res, rej);
		});

	// otherwise -> Promise it
	return Promise.resolve(g);
}

// wait
function wait(msec, val) {
	if (arguments.length === 1) val = msec;
	if (msec <= 0) return Promise.resolve(val);
	return new Promise(function (res) { return setTimeout(res, msec, val); });
}

// normalize callback
function normalizeCallback(cb) {
	return function callback(err, val) {
		// TODO cb.length === 1 ?
		if (arguments.length === 1 && !(err instanceof Error))
			cb(null, arguments[0]);
		else
			cb.apply(null, arguments);
	};
}

// Channel with Promise
function Channel() {
	const sends = [], recvs = [];

	channel.then = thenChannel;
	channel.catch = catchChannel;
	return channel;

	function channel(err, val) {
		if (typeof err === F)
			recvs.push(normalizeCallback(err));
		else
			sends.push(arguments);

		if (recvs.length > 0 && sends.length > 0)
			recvs.shift().apply(null, sends.shift());

		return channel;
	}
}

// channel.then()
function thenChannel(res, rej) {
	return this(cb);

	function cb(err, val) {
		if (err) return res ? rej(err) : err;
		return res ? res(val) : val;
	}
}

// channel.catch()
function catchChannel(rej) {
	return this(cb);

	function cb(err, val) {
		if (err) return res ? rej(err) : err;
		return val;
	}
}

// pipe -> write(), end()
// stream -> on('data', f), on('end', f), on('error', f)
//            [data,...]  -------^
// new-thunk ::: promise + thunk + ?)

/*
 * TEST
 */
function assertEQ(val, exp, prefix) {
	if (!prefix) prefix = '';
	if (val === exp) return val;
	if ((val !== val) && (exp !== exp)) return val; // NaN
	if (typeof val !== typeof exp)
		return diffs('type', prefix, val, exp);
	if (typeof val === N || typeof val === B || typeof val === S)
		return diffs('val', prefix, val, exp);
	if (!val || !exp)
		return diffs('null', prefix, val, exp);
	if (typeof val === O) {
		if (val.constructor !== exp.constructor)
			return diffs('ctor', prefix, val, exp);
		if (val.constructor === Array) {
			if (val.length !== exp.length)
				return diffs('len', prefix, val, exp);
			return '[' + val.map((v, i) => assertEQ(v, exp[i], prefix + '[' + i + ']')).join(', ') + ']';
		}
		if (val.constructor === Object) {
			const keys = Object.keys(val);
			if (keys.join() !== Object.keys(exp).join())
				return diffs('keys', prefix, val, exp);
			return '{' + keys.map((k) => k + ': ' + assertEQ(val[k], exp[k], prefix + '.' + k)).join(', ') + '}';
		}
		return val; // ctor is equal. almost same.
	}

	return diffs('else', prefix, val, exp);
}
function diffs(word, prefix, val, exp) {
	return '\x1b[1;31m*diffrent ' + word + ': ' + prefix + ' ' + toString(val) + ' != ' + toString(exp) + '*\x1b[m';
}
function toString(val) {
	if (val == null) return val + '';
	if (typeof val === N || typeof val === B || typeof val === S)
		return JSON.stringify(val);
	return require('util').inspect(val);
}

aa(function* () {
	// primitives, and basic object
	console.log('aa 010 undefined:', assertEQ(yield undefined, undefined));
	console.log('aa 020 null:', assertEQ(yield null, null));
	console.log('aa 030 true:', assertEQ(yield true, true));
	console.log('aa 040 false:', assertEQ(yield false, false));
	console.log('aa 050 123:', assertEQ(yield 123, 123));
	console.log('aa 060 str:', assertEQ(yield 'str', 'str'));
	console.log('aa 070 []:', assertEQ(yield [], []));
	console.log('aa 080 {}:', assertEQ(yield {}, {}));
	console.log('aa 090 Error: ' + assertEQ(yield new Error('090'), new Error('090')));

	// Promises
	console.log('aa 100 Promise.resolve(100):', assertEQ(yield Promise.resolve(100), 100));
	try { console.log('aa 110 Promise.reject(110):', assertEQ(yield Promise.reject(110), 'exception')); }
	catch (err) { console.log('aa 110 Promise.reject(110): catch', assertEQ(err, 110)); }
	try { console.log('aa 111 Promise.reject(Error(111)): ' + assertEQ(yield Promise.reject(new Error(111)), 'exception')); }
	catch (err) { console.log('aa 111 Promise.reject(Error(111)): catch ' + assertEQ(err, new Error(111))); }
	console.log('aa 120 aa.wait(120):', assertEQ(yield aa.wait(120), 120));
	console.log('aa 130 aa.wait(130, 131):', assertEQ(yield aa.wait(130, 131), 131));

	// number -> wait
	console.log('aa 140:', assertEQ(yield 140, 140));

	// thunk, callback => callback()
	console.log('aa 150 cb => cb(150):', assertEQ(yield cb => cb(150), 150));
	console.log('aa 160 cb => cb(null, 160):', assertEQ(yield cb => cb(null, 160), 160));
	try { console.log('aa 170 cb => cb(Error(170)): ' + assertEQ(yield cb => cb(new Error(170)), 'exception')); }
	catch (err) { console.log('aa 170 cb => cb(Error(170)): catch ' + assertEQ(err, new Error(170))); }
	console.log('aa 180 cb => setTimeout(cb, 180, 180):', assertEQ(yield cb => setTimeout(cb, 180, 180), 180));
	try { console.log('aa 190 cb => setTimeout(cb, 190, Error(190)): ' + assertEQ(yield cb => setTimeout(cb, 190, new Error(190)), 'exception')); }
	catch (err) { console.log('aa 190 cb => setTimeout(cb, 190, Error(190)): catch ' + assertEQ(err, new Error(190))); }

	// generator, generator function
	console.log('aa 200 *gtor func:', assertEQ(yield function* () { return yield 200; }, 200));
	console.log('aa 210 *gtor() -> iter:', assertEQ(yield function* () { return yield 210; }(), 210));
	console.log('aa 220 *gtor() -> iter:', assertEQ(yield* function* () { return yield 220; }(), 220));

	// Channel
	const chan = aa();
	chan(100);
	chan(200);
	setTimeout(chan, 300, 300);
	setTimeout(chan, 400, 400);
	setTimeout(chan, 500, null, 500);
	setTimeout(chan, 600, new Error('600'));
	console.log('aa 300 chan 100:', assertEQ(yield chan, 100));
	console.log('aa 300 chan 200:', assertEQ(yield chan, 200));
	console.log('aa 300 chan 300:', assertEQ(yield chan, 300));
	console.log('aa 300 chan 400:', assertEQ(yield chan, 400));
	console.log('aa 300 chan 500:', assertEQ(yield chan, 500));
	try { console.log('aa 300 chan 600:', assertEQ(yield chan, 'exception')); }
	catch (e) { console.log('aa 300 chan 600: ' + e); }
	console.log('aa 320');

	chan(100);
	chan(200);
	setTimeout(chan, 300, 300);
	setTimeout(chan, 400, 400);
	console.log('aa 330 chan 400:', assertEQ(yield chan
		.then(v => console.log('aa 330 chan 100:', assertEQ(v, 100)))
		.then(v => console.log('aa 330 chan 200:', assertEQ(v, 200)))
		.then(v => console.log('aa 330 chan 300:', assertEQ(v, 300))), 400));

	// async await with Channel
	yield async function () {
		const chan = aa();
		chan(100);
		chan(200);
		setTimeout(chan, 300, 300);
		setTimeout(chan, 400, null, 400);
		setTimeout(chan, 500, null);
		setTimeout(chan, 600, 600);
		setTimeout(chan, 700, null, 700);
		setTimeout(chan, 800, new Error('800'));
		const exps = [100, 200, 300, 400, 600, 700];
		let v;
		while (v = await chan)
			console.log('aa 340 chan:', assertEQ(v, exps.shift()));

		try {
			while (v = await chan)
				console.log('aa 340 chan:', assertEQ(v, exps.shift()));
		} catch (e) {
			console.log('aa 340 chan: ' + e);
		}
	}();

	console.log('aa 400: []', assertEQ(yield [
		Promise.resolve(11),
		22,
		cb => cb(33),
		cb => cb(null, 44),
		function* () { return yield 55; },
		function* () { return yield 66; }(),
		async function () { return await aa.wait(77); },
		[Promise.resolve(88), Promise.resolve(99), 3000],
		new Error('zzz'),
	], [11, 22, 33, 44, 55, 66, 77, [88, 99, 3000], new Error('zzz')]));
	console.log('aa 400: {}', assertEQ(yield {
		a: Promise.resolve(11),
		b: 22,
		c: cb => cb(33),
		d: cb => cb(null, 44),
		e: function* () { return yield 55; },
		f: function* () { return yield 66; }(),
		g: async function () { return await aa.wait(77); },
		h: { i: Promise.resolve(88), j: Promise.resolve(99), k: 3000 },
		z: new Error('zzz'),
	}, { a: 11, b: 22, c: 33, d: 44, e: 55, f: 66, g: 77, h: { i: 88, j: 99, k: 3000 }, z: new Error('zzz') }));

	const fs = require('fs');
	const FILE = 'aa-yocto.log'
	fs.writeFileSync(FILE, 'data');
	const result = yield aa(fs.createReadStream(FILE));
	console.log('aa 500', assertEQ(result.map(x => x.toString()), ['data']));
	fs.unlinkSync(FILE);

	console.log('aa 900');
	console.log('aa 900:', assertEQ(yield aa(undefined), undefined));
	console.log('aa 900:', assertEQ(yield aa(null), null));
	console.log('aa 900:', assertEQ(yield aa(true), true));
	console.log('aa 900:', assertEQ(yield aa(false), false));
	console.log('aa 900:', assertEQ(yield aa(0), 0));
	console.log('aa 900:', assertEQ(yield aa('str'), 'str'));
	console.log('aa 900:', assertEQ(yield aa([]), []));
	console.log('aa 900:', assertEQ(yield aa({}), {}));
	console.log('aa 999');
}).catch(err => console.log(assertEQ(err, 'exception')));
