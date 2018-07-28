// ES7 Async Await and Babel with npm regenerator.runtime()
'use strict';

let main = (function () {
	var _marked = [main].map(regeneratorRuntime.mark);

	var ref = _asyncToGenerator(function main() {
		var result;
		return regeneratorRuntime.wrap(function main$(_context) {
			while (1) switch (_context.prev = _context.next) {
				case 0:
					console.log('main: started');

					// シーケンシャル処理(逐次処理)
					_context.next = 3;
					return sleep(200, 'a1');

				case 3:
					result = _context.sent;

					console.log('main-a1: sleep: a1 =', result);
					_context.next = 7;
					return sleep(100, 'a2');

				case 7:
					result = _context.sent;

					console.log('main-a2: sleep: a2 =', result);
					_context.next = 11;
					return sleep(300, 'a3');

				case 11:
					result = _context.sent;

					console.log('main-a3: sleep: a3 =', result);

					// パラレル処理(並行処理)
					_context.next = 15;
					return Promise.all([sleep(200, 'b1'), sleep(100, 'b2'), sleep(300, 'b3')]);

				case 15:
					result = _context.sent;

					console.log('main-b : Promise.all([promises]): [b1, b2, b3] =', stringify(result));

					// asyncなsub()をawaitで呼ぶ
					_context.next = 19;
					return sub('c');

				case 19:
					result = _context.sent;

					console.log('main-c : sub(c) =', result);
					// asyncなsub()を並行処理で呼ぶ
					_context.next = 23;
					return Promise.all([sub('d1'), sub('d2')]);

				case 23:
					result = _context.sent;

					console.log('main-d : Promise.all([promises]): [d1, d2] =', stringify(result));

					// ここは使わない
					_context.next = 27;
					return [sleep(200, 'e1'), sleep(100, 'e2')];

				case 27:
					result = _context.sent;

					console.log('main-e : Array does not work :', stringify(result));
					_context.next = 31;
					return { x: sleep(200, 'f1'), y: sleep(100, 'f2') };

				case 31:
					result = _context.sent;

					console.log('main-f : Object does not work:', stringify(result));

					return _context.abrupt('return', 'return value!');

				case 34:
				case 'end':
					return _context.stop();
			}
		}, _marked[0], this);
	});

	return function main() {
		return ref.apply(this, arguments);
	};
})();

let sub = (function () {
	var _marked2 = [sub].map(regeneratorRuntime.mark);

	var ref = _asyncToGenerator(function sub(val) {
		return regeneratorRuntime.wrap(function sub$(_context2) {
			while (1) switch (_context2.prev = _context2.next) {
				case 0:
					_context2.next = 2;
					return sleep(100, val + '-x1');

				case 2:
					console.log('sub-' + val + '-x1: sleep: ' + val + '-x1');

					_context2.next = 5;
					return sleep(100, val + '-x2');

				case 5:
					console.log('sub-' + val + '-x2: sleep: ' + val + '-x2');

					return _context2.abrupt('return', val);

				case 7:
				case 'end':
					return _context2.stop();
			}
		}, _marked2[0], this);
	});

	return function sub(_x) {
		return ref.apply(this, arguments);
	};
})();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, "next"); var callThrow = step.bind(null, "throw"); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

require('babel-polyfill'); // おまじない
//require('regenerator').runtime();

console.log('main: start');
main().then(function (val) {
	console.log('main: finish:', val);
});

function sleep(msec, val) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, msec, val);
	});
}

function stringify(object) {
	var str = '';
	if (object instanceof Array) {
		for (var i = 0, n = object.length; i < n; ++i) str += (str ? ', ' : '') + object[i];
		return '[' + str + ']';
	} else {
		for (var key in object) str += (str ? ', ' : '') + key + ':' + object[key];
		return '{' + str + '}';
	}
}
