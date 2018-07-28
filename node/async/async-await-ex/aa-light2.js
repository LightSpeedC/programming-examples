void function () {
	'use strict';

	try { var GeneratorFunction = eval('(function *() {}).constructor'); }
	catch (e) {}

	function aa(value) {
		//console.log('\x1b[32maa:', value, '\x1b[m');
		//prt(value, '32maa: ');
		if (arguments.length > 1) return seq(arguments);

		if (!value || // null, undefined, false, 0, '', NaN,
				typeof value === 'number' ||
				typeof value === 'string' ||
				typeof value === 'boolean')
			return Promise.resolve(value);

		if (value instanceof String ||
			value instanceof Boolean ||
			value instanceof Number) return Promise.resolve(value);
		if (value instanceof Error) return Promise.reject(value);

		// promise
		if (typeof value.then === 'function') return value;

		// generator function
		if (typeof value === 'function' && value.constructor === GeneratorFunction)
			value = value.call(this);

		// thunk, array or object (not generator)
		if (typeof value === 'function' || typeof value === 'object' &&
			(value.constructor === Array || typeof value.next !== 'function'))
			return (value = xx(value)).then ? value : Promise.resolve(value);

		var gtor = value;

		return new Promise(function (resolve, reject) {
			// thunk
			//if (typeof gtor === 'function')
			//	return gtor(function (err, val) {
			//		if (err) reject(err);
			//		else resolve(val);
			//	});

			// generator
			next();

			function error(err) {
				try { gtor.throw(err); }
				catch (err) { reject(err); }
			}

			function next(value) {
				//console.log('\x1b[33mnx:', value, '\x1b[m');

				try {
					value = xx(value);
					if (value && value.then)
						return value.then(next, error);

					var object = gtor.next(value);

					value = xx(object.value);
					if (object.done) {
						if (value && value.then)
							value.then(resolve, reject);
						else
							resolve(value);
					}
					else {
						if (value && value.then)
							value.then(next, error);
						else
							next(value);
					}
				}
				catch (err) { reject(err); }
			} // next
		}); // new Promise
	} // aa

	function xx(value) {
		//console.log('\x1b[36mxx:', value, '\x1b[m');
		//prt(value, '36mxx: ');
		if (!value || // null, undefined, false, 0, '', NaN,
				typeof value === 'number' ||
				typeof value === 'string' ||
				typeof value === 'boolean')
			return value;

		if (value instanceof String ||
			value instanceof Boolean ||
			value instanceof Number) return value;
		if (value instanceof Error) return Promise.reject(value);

		// promise
		if (typeof value.then === 'function') return value;

		// generator or generator function
		if (typeof value === 'object' && typeof value.next === 'function' ||
			typeof value === 'function' && value.constructor === GeneratorFunction)
			return aa(value);

		// thunk
		if (typeof value === 'function')
			return new Promise(function (resolve, reject) {
				value(function (err, val) {
					if (err) reject(err);
					else resolve(val);
				});
			});

		// array
		if (value.constructor === Array) {
			var array = [], n = 0;
			for (var i = 0; i < value.length; ++i) {
				var val = array[i] = xx(value[i]);
				if (val && val.then) ++n;
			}
			if (n === 0) return array;
			return new Promise(function (resolve, reject) {
				array.forEach(function arrayEach(val, i) {
					if (val && val.then) {
						val.then(
							function (val) {
								val = array[i] = xx(val);
								if (val && val.then) arrayEach(val, i);
								else if (--n === 0) resolve(array);
							},
							function (err) { n = 0; reject(err); });
					}
				});
			});
		}

		// object
		if (typeof value === 'object') {
			var object = {}, keys = Object.keys(value), n = 0;
			for (var i = 0; i < keys.length; ++i) {
				var key = keys[i];
				var val = object[key] = xx(value[key]);
				if (val && val.then) ++n;
			}
			if (n === 0) return object;
			return new Promise(function (resolve, reject) {
				keys.forEach(function objectEach(key) {
					var val = object[key];
					if (val && val.then) {
						val.then(
							function (val) {
								val = object[key] = xx(val);
								if (val && val.then) objectEach(key);
								else if (--n === 0) resolve(object);
							},
							function (err) { n = 0; reject(err); });
					}
				});
			});
		}

		console.log('*********', value); // no one comes here!?
		return aa(value);
	}

	// sequential
	function seq2(args) {
		var array = [];
		for (var i = 0; i < args.length; ++i) array[i] = args[i];
		return aa(function *() {
			for (var i = 0; i < args.length; ++i)
				array[i] = yield array[i];
			return array;
		});
	}
	function seq(args) {
		return new Promise(function (resolve, reject) {
			if (args.length === 0) return resolve([]);
			var array = [];
			for (var i = 0; i < args.length; ++i) array[i] = args[i];
			i = 0;
			next(array[i]);
			function next(val) {
				val = array[i] = xx(array[i] = val);
				if (val && val.then) return val.then(next, reject);
				i++;
				if (i >= args.length) return resolve(array);
				next(array[i]);
			}
		});
	}


	function prt() {
		var color = arguments[--arguments.length];
		process.stdout.write('\x1b[' + color);
		console.log.apply(console, arguments);
		process.stdout.write('\x1b[m');
	}


	module.exports = aa;
	Function('return this')().aa = aa;
}();


var delay = (ms, val) => cb => setTimeout(cb, ms, null, val);
var sleep = (ms, val) => new Promise(res => setTimeout(res, ms, val));

aa(function *() {
	console.log('aa-start');
	console.log('yield 123:',         yield 123);
	console.log('yield NaN:',         yield NaN);
	console.log('yield true:',        yield true);
	console.log('yield false:',       yield false);
	console.log('yield "str":',       yield "str");
	console.log('yield []:',          yield []);
	console.log('yield {}:',          yield {});
	console.log('yield new Str():',   yield new String('str'));
	console.log('yield null:',        yield null);

	console.log('yield delay a:',     yield delay(100, 'a'));
	console.log('yield [a,b]:',       yield [delay(100, 'a'), delay(100, 'b')]);
	console.log('yield [a,[b]]:',     yield [delay(100, 'a'), [delay(100, 'b')]]);
	console.log('yield {x:a,y:b}:',   yield {x:delay(100, 'a'), y:{z:delay(100, 'b')}});
	console.log('yield Promise:',     yield Promise.resolve('resolved'));

	console.log('yield w w aa:',      yield delay(100, delay(100, 'aa')));
	console.log('yield [aa,bb]:',     yield [delay(100, delay(100, 'aa')), [delay(100, delay(100, 'bb'))]]);
	console.log('yield {x:aa,y:bb}:', yield {x:delay(100, delay(100, 'aa')), y:{z:delay(100, delay(100, 'bb'))}});
	console.log('yield Promise:',     yield Promise.resolve(delay(100, 'aa')));

	console.log('yield par:',         yield [
		function *() { var x = yield delay(350, 'par1'); console.log(x); return x; },
		function *() { var x = yield delay(300, 'par2'); console.log(x); return x; },
		sleep(250, 'par3').then(x => (console.log(x), x)),
		sleep(200, 'par4').then(x => (console.log(x), x)),
		cb => delay(150, 'par5')((e, x) => (console.log(x), cb(null, x))),
		cb => delay(100, 'par6')((e, x) => (console.log(x), cb(null, x)))
	]);
	console.log('yield seq:',         yield aa(
		function *() { var x = yield delay(350, 'seq1'); console.log(x); return x; },
		function *() { var x = yield delay(300, 'seq2'); console.log(x); return x; },
		cb => sleep(250, 'seq3').then(x => (console.log(x), cb(null, x))),
		cb => sleep(200, 'seq4').then(x => (console.log(x), cb(null, x))),
		cb => delay(150, 'seq5')((e, x) => (console.log(x), cb(null, x))),
		cb => delay(100, 'seq6')((e, x) => (console.log(x), cb(null, x)))
	));

	//throw new Error('xxx');
	console.log('aa-end');
	return 'aa-end';
}).then(
	val => console.log('@@@@@@@@@@@@@@', val),
	err => console.log('**************', err.stack || err)
);
