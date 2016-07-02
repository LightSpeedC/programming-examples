void function () {
	'use strict';

	const L = 5;
	const M = 1000;
	const N = 100000;
	const values = [123, 12.5, true, false, 'str',
		null, undefined, {}, [], /regex/, () => 0];
	const array = [];

	for (let i = 0; i < M; ++i)
		array[i] = values[Math.random() * values.length | 0];

	const res = fnEqNull(M, array);
	if (res !== fnStrictEqNullUndef(M, array)) throw new Error('eh!?');
	if (res !== fnStrictEqNullUndef2(M, array)) throw new Error('eh!?');

	typeof gc === 'function' ? gc() : console.log('node --expose-gc required');

	for (let i = 0; i < L; ++i) {
		benchmark('eq-null            ', fnEqNull,             N, res, M, array);
		benchmark('s-eq-undef-or-null ', fnStrictEqNullUndef,  N, res, M, array);
		benchmark('s-eq-undef-or-null2', fnStrictEqNullUndef2, N, res, M, array);
		console.log('----');
	}

	// benchmark
	function benchmark(name, fn, n, res, m, args) {
		typeof gc === 'function' && gc();
		console.time(name);
		for (let i = 0; i < n; ++i)
			if (res !== fn(m, args)) throw new Error('eh!?');
		console.timeEnd(name);
		typeof gc === 'function' && gc();
	}

	function fnEqNull(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			if (arg[i] == null) res++;
		return res;
	}

	function fnStrictEqNullUndef(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			if (arg[i] === undefined || arg[i] === null) res++;
		return res;
	}

	function fnStrictEqNullUndef2(n, arg) {
		let res = 0, x;
		for (let i = 0; i < n; ++i)
			if ((x = arg[i]) === undefined || x === null) res++;
		return res;
	}

} ();
