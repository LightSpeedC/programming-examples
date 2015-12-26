void function () {

var aa = require('./aa5');
var fs = require('fs');

function test(val) { return function (cb) { cb(null, val); }; }
function read(fil) { return function (cb) { fs.readFile(fil, 'utf8', cb); }; }
function wait(sec, val) { return function (cb) { setTimeout(cb, sec * 1000, null, val); }; }
function xxxx(sec) { return function (cb) { setTimeout(cb, sec * 1000, new Error('always error')); }; }

function errmsg(e) {
	return e instanceof Error ? '\x1b[31m' + e.stack + '\x1b[m' : e;
}

aa(function *() {
	//console.log(yield read('README.md'));
	yield wait(0.1);
	//console.log(yield read('package.json'));
	//throw new Error('xxxx');

	try { yield xxxx(0.1); }
	catch (e) { console.error(errmsg(e)); }

	console.log('error caught!');
	console.log('expected: cb 123    ==', yield cb => cb(null, 123));
	console.log('expected: 123       ==', yield 123);
	console.log('expected: undefined ==', yield undefined);
	console.log('expected: null      ==', yield null);
	console.log('expected: 1.23      ==', yield 1.23);
	console.log('expected: "str"     ==', yield 'str');
	console.log('expected: true      ==', yield true);
	console.log('expected: false     ==', yield false);
	console.log('expected: {}        ==', yield {});
	console.log('expected: []        ==', yield []);
	console.log('expected: Promise 1 ==', yield Promise.resolve(1));
	console.log('expected: Promise 2 ==', yield Promise.resolve(Promise.resolve(2)));
	console.log('expected: cb cb 123 ==', yield cb => cb(null, cb => cb(null, 123)));

	if (123       !== (yield 123))       throw new Error('eh!?');
	if (undefined !== (yield undefined)) throw new Error('eh!?');
	if (null      !== (yield null))      throw new Error('eh!?');
	if (1.23      !== (yield 1.23))      throw new Error('eh!?');
	if ('str'     !== (yield 'str'))     throw new Error('eh!?');
	if (true      !== (yield true))      throw new Error('eh!?');
	if (false     !== (yield false))     throw new Error('eh!?');
	if (JSON.stringify(yield {}) !== '{}') throw new Error('eh!?');
	if (JSON.stringify(yield []) !== '[]') throw new Error('eh!?');

	var loops = [5e4, 5e4, 5e4, 5e4, 1e5, 1e5, 1e5, 1e5, 2e5, 1e6, 2e6, 1e7];
	for (var j in loops) {
		//var time = Date.now();
		var x = process.hrtime();
		for (var i = 0, N = loops[j]; i < N; ++i)
			if (i !== (yield test(i)))
			//if (i !== (yield Promise.resolve(i)))
				throw new Error('eh!? ' + i);
		var y = process.hrtime();
		var time = x[0] + x[1] / 1e9;
		var delta = y[0] + y[1] / 1e9 - time;
		//var delta = (Date.now() - time) / 1000;
		console.log('%s sec, %s Ktps', delta.toFixed(6), (Math.floor(N / delta) / 1000).toFixed(3), N);
		yield wait(0.1);
	}

	var N = 1e4;
	for (var i = 0; i < N; ++i) if (null      !== (yield null))      throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (undefined !== (yield undefined)) throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (1.2       !== (yield 1.2))       throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if ('str'     !== (yield 'str'))     throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (true      !== (yield true))      throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if (false     !== (yield false))     throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if ((yield {}).constructor !== Object) throw new Error('eh!?');
	for (var i = 0; i < N; ++i) if ((yield []).constructor !== Array)  throw new Error('eh!?');

	console.log('GeneratorFunction() 123 ==', yield function*() { yield wait(0.1); return 123; }());
	console.log('GeneratorFunction   123 ==', yield function*() { yield wait(0.1); return 123; });
	console.log('GeneratorFunction() 456 ==', yield function*() { yield wait(0.1); return Promise.resolve(456); }());
	console.log('GeneratorFunction   456 ==', yield function*() { yield wait(0.1); return Promise.resolve(456); });
	console.log('GeneratorFunction() 789 ==', yield function*() { yield wait(0.1); return cb => cb(null, 789); }());
	console.log('GeneratorFunction   789 ==', yield function*() { yield wait(0.1); return cb => cb(null, 789); });
	console.log('[w, w]           ==', yield [wait(0.2, 0.2), wait(0.1, 0.1)]);
	console.log('{x:w, y:w}       ==', yield {x:wait(0.2, 0.2), y:wait(0.1, 0.1)});
	console.log('[[w, w]]         ==', yield [[wait(0.2, 0.2), wait(0.1, 0.1)]]);
	console.log('{x:[w], y:{z:w}} ==', yield {x:[wait(0.2, 0.2)], y:{z:wait(0.1, 0.1)}});

	console.log('expected: 100           ==', yield cb => cb(null, 100));
	console.log('expected: [101,102]     ==', yield cb => cb(null, 101, 102));
	console.log('expected: [103,104,105] ==', yield cb => cb(null, 103, 104, 105));
	console.log('expected: [0,106]       ==', yield cb => cb(0, 106));
	console.log('expected: ["",107]      ==', yield cb => cb('', 107));
	console.log('expected: [108,109]     ==', yield cb => cb(108, 109));
	console.log('expected: [110,111,112] ==', yield cb => cb(110, 111, 112));
	//console.log('err?', yield new TypeError('09876'));
	//console.log('err?', yield new Error('54321'));
	//throw new Error('67890');
	//return Promise.resolve('12345');
	//return Promise.reject(new Error('12345'));

	// parallel
	console.log(yield [
		function *() { console.log(yield wait(0.2, 0.2)); return 0.2; },
		function *() { console.log(yield wait(0.3, 0.3)); return 0.3; },
		function *() { console.log(yield wait(0.1, 0.1)); return 0.1; }
	]);

	// sequential
	console.log(yield aa(
		function *() { console.log(yield wait(0.2, 0.2)); return 0.2; },
		function *() { console.log(yield wait(0.3, 0.3)); return 0.3; },
		function *() { console.log(yield wait(0.1, 0.1)); return 0.1; }
	));

	return 12345;
}()).then(val => console.log('finished: val:', val), err => console.error('finished: err:', errmsg(err)));
//}())((err, val) => console.log('finished: err:', errmsg(err), 'val:', val));

}();
