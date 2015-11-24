void function () {
	'use strict';

	try {
		var GeneratorFunction = eval('(function *() {}).constructor');
	} catch (e) {}

	function aa(gtor) {
		if (!gtor || // null, undefined, false, 0, '',
				typeof gtor === 'number' ||
				typeof gtor === 'string' ||
				typeof gtor === 'boolean')
			return Promise.resolve(gtor);

		// promise
		if (typeof gtor.then === 'function') return gtor;

		// array
		if (gtor instanceof Array)
			return Promise.all(gtor.map(aa));

		// object (not generator)
		if (typeof gtor === 'object' && typeof gtor.next !== 'function') {
			var keys = Object.keys(gtor);
			return Promise.all(keys.map(function (key) { return aa(gtor[key]); }))
			.then(function (vals) {
				var res = {};
				for (var i = 0; i < keys.length; ++i)
					res[keys[i]] = vals[i];
				return res;
				//return vals.reduce(function (res, val, i) {
				//	res[keys[i]] = val;
				//	return res;
				//}, {});
			});
		}

		// generator function
		if (typeof gtor === 'function' && gtor.constructor === GeneratorFunction)
			gtor = gtor.call(this);

		return new Promise(function (resolve, reject) {
			// thunk
			if (typeof gtor === 'function')
				return gtor(function (err, val) {
					if (err) reject(err);
					else resolve(val);
				});

			// generator
			setImmediate(next);

			function error(err) {
				try { gtor.throw(err); }
				catch (err) { reject(err); }
			}

			function next(val) {
				try {
					var object = gtor.next(val);
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


var wait = (ms, val) => cb => setTimeout(cb, ms, null, val);

aa(function *() {
	console.log('aa1');
	console.log('yield 1:',         yield 1);
	console.log('yield true:',      yield true);
	console.log('yield false:',     yield false);
	console.log('yield "str":',     yield "str");
	console.log('yield []:',        yield []);
	console.log('yield {}:',        yield {});
	console.log('yield null:',      yield null);
	console.log('yield wait a:',    yield wait(100,'a'));
	console.log('yield [a,b]:',     yield [wait(100,'a'), [wait(100,'b')]]);
	console.log('yield {x:a,y:b}:', yield {x:wait(100,'a'), y:{z:wait(100,'b')}});
	console.log('yield Promise:',   yield Promise.resolve('resolved'));
	//throw new Error('xxx');
	console.log('aa2');
	return 'aa-end';
}).then(
	(val) => console.log('@@@@@@@@@@@@@@', val),
	(err) => console.log('**************', err.stack)
);
