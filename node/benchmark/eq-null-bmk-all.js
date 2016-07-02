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

	const fnsObjTypeObj = {undefined: function () { return 1; },
		string: function () { return 0; },
		number: function () { return 0; },
		boolean: function () { return 0; },
		object: function (obj) { return obj === null ? 1 : 0; },
		'function': function () { return 0; },
		'symbol': function () { return 0; }
	};

	for (let i = 0; i < L; ++i) {
		benchmark('eq-null            ', fnEqNull,             N, res, M, array);
		//benchmark('s-eq-null          ', fnStrictEqNull,       N, res, M, array);
		//benchmark('s-eq-undef         ', fnStrictEqUndef,      N, res, M, array);
		//benchmark('s-eq-type-undef    ', fnStrictEqTypeUndef,  N, res, M, array);
		//benchmark('s-eq-type-object   ', fnStrictEqTypeObj,    N, res, M, array);
		benchmark('s-eq-undef-or-null ', fnStrictEqNullUndef,  N, res, M, array);
		benchmark('s-eq-undef-or-null2', fnStrictEqNullUndef2, N, res, M, array);
		//benchmark('switch-type-object ', fnSwitchTypeObj,      N, res, M, array);
		//benchmark('obj-type-object    ', fnObjTypeObj,         N, res, M, array);
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

	function fnStrictEqNull(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			if (arg[i] === null) res++;
		return res;
	}

	function fnStrictEqUndef(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			if (arg[i] === undefined) res++;
		return res;
	}

	function fnStrictEqTypeUndef(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			if (typeof arg[i] === 'undefined') res++;
		return res;
	}

	function fnStrictEqTypeObj(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			if (typeof arg[i] === 'object') res++;
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

	function fnSwitchTypeObj(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i) {
			switch (typeof arg[i]) {
				case 'object': res++;
			}
		}
		return res;
	}

	function fnObjTypeObj(n, arg) {
		let res = 0;
		for (let i = 0; i < n; ++i)
			res += fnsObjTypeObj[typeof arg[i]](arg[i]);
		return res;
	}

} ();
