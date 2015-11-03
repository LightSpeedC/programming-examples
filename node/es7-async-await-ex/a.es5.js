'use strict';

let main = (function () {
	var ref = _asyncToGenerator(function* main() {
		console.log('a1');
		yield sleep(100, 'a');
		console.log('a9');
	});

	return function main() {
		return ref.apply(this, arguments);
	};
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

main();

function sleep(msec, val) {
	console.log('sleep', val);
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, msec, val);
	});
}
