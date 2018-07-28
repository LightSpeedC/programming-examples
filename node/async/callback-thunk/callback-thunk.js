void function () {
	'use strict';

	const Thunk = require('./thunk');

	function someProc(msec, val) {
		var thunk = Thunk(this, arguments);
		setTimeout(thunk.callback, msec, null, val);
		return thunk;
	}

	someProc(1000, () => console.log('1000-1'));
	someProc(2000)(() => console.log('2000-1'));

	someProc(3000, '3000-1')
	((err, val) => err ? err : (console.log('3000-1', err, val), '3000-2'))
	((err, val) => err ? err : (console.log('3000-2', err, val), '3000-3'))
	((err, val) => { throw new Error('err in ' + val); })
	((err, val) => (console.log('3000-4', err, val), '3000-5'))
	((err, val) => (console.log('3000-5', err, val), someProc(1000, '3000-6')))
	((err, val) => (console.log('3000-6', err, val), Promise.resolve('3000-7')))
	((err, val) => (console.log('3000-7', err, val), '3000-8'))
	;

	someProc(5000, '5000-0', function () { console.log('5000-0', arguments); });
	someProc(5000, '5000-1', (result) => console.log('5000-1', result));
	someProc(5000, '5000-2', (err, val) => console.log('5000-2', err, val));
	someProc(5000, '5000-3', (err, val, val2) => console.log('5000-3', err, val, val2));

	someProc(6000, '6000-0', function () { console.log('6000-0', arguments); });
	someProc(6000, '6000-1', (result) => console.log('6000-1', result));
	someProc(6000, '6000-2', (err, val) => console.log('6000-2', err, val));
	someProc(6000, '6000-3', (err, val, val2) => console.log('6000-3', err, val, val2));

}();
