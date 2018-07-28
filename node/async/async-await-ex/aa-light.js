void function () {
	'use strict';

	try { var GeneratorFunction = eval('(function *() {}).constructor'); }
	catch (e) {}

	function aa(value) {
		//console.log('\x1b[32maa:', value, '\x1b[m');
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

		// array
		if (value.constructor === Array)
			return Promise.all(value.map(aa));

		// object (not generator)
		if (typeof value === 'object' && typeof value.next !== 'function') {
			var keys = Object.keys(value);
			return Promise.all(keys.map(function (key) { return aa(value[key]); }))
			.then(function (vals) {
				var res = {};
				for (var i = 0; i < keys.length; ++i)
					res[keys[i]] = vals[i];
				return res;
			});
		}

		// generator function
		if (typeof value === 'function' && value.constructor === GeneratorFunction)
			value = value.call(this);

		return new Promise(function (resolve, reject) {
			// thunk
			if (typeof value === 'function')
				return value(function (err, val) {
					if (err) reject(err);
					else resolve(val);
				});

			// generator
			next();

			function error(err) {
				try { value.throw(err); }
				catch (err) { reject(err); }
			}

			function next(val) {
				try {
					var object = value.next(val);
					if (object.done) return resolve(object.value);
					aa(object.value).then(next, error);
				}
				catch (err) { reject(err); }
			} // next
		}); // new Promise
	} // aa

	module.exports = aa;
	Function('return this')().aa = aa;
}();


var delay = (ms, val) => cb => setTimeout(cb, ms, null, val);

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

	//throw new Error('xxx');
	console.log('aa-end');
	return 'aa-end';
}).then(
	val => console.log('@@@@@@@@@@@@@@', val),
	err => console.log('**************', err.stack || err)
);
