// ES7 Async Await and Babel with npm regenerator.runtime()

'use strict';

require('regenerator').runtime();

console.log('main: start');
main().then(function (val) {
	console.log('main: finish:', val);
});

function main() {
	var result;
	return regeneratorRuntime.async(function main$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				console.log('main: started');

				// シーケンシャル処理(逐次処理)
				context$1$0.next = 3;
				return regeneratorRuntime.awrap(sleep(2000, 'a1'));

			case 3:
				result = context$1$0.sent;

				console.log('main-a1: simple Promise: a1 =', result);
				context$1$0.next = 7;
				return regeneratorRuntime.awrap(sleep(2000, 'a2'));

			case 7:
				result = context$1$0.sent;

				console.log('main-a2: simple Promise: a2 =', result);

				// パラレル処理(並行処理)
				context$1$0.next = 11;
				return regeneratorRuntime.awrap(Promise.all([sleep(3000, 'b1'), sleep(3000, 'b2')]));

			case 11:
				result = context$1$0.sent;

				console.log('main-b: Promise.all([promises]): [b1, b2] =', result);

				// asyncなsub()をawaitで呼ぶ
				context$1$0.next = 15;
				return regeneratorRuntime.awrap(sub('c'));

			case 15:
				result = context$1$0.sent;

				console.log('main-c: sub(c) =', result);
				// asyncなsub()を並行処理で呼ぶ
				context$1$0.next = 19;
				return regeneratorRuntime.awrap(Promise.all([sub('d1'), sub('d2')]));

			case 19:
				result = context$1$0.sent;

				console.log('main-d: Promise.all([promises]): [d1, d2] =', result);

				// ここは使わない
				context$1$0.next = 23;
				return regeneratorRuntime.awrap([sleep(3000, 'e1'), sleep(3000, 'e2')]);

			case 23:
				result = context$1$0.sent;

				console.log('main-e: Array does not work:', result);
				context$1$0.next = 27;
				return regeneratorRuntime.awrap({ x: sleep(3000, 'f1'), y: sleep(3000, 'f2') });

			case 27:
				result = context$1$0.sent;

				console.log('main-f: Object does not work:', result);

				return context$1$0.abrupt('return', 'return value!');

			case 30:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

function sub(val) {
	return regeneratorRuntime.async(function sub$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return regeneratorRuntime.awrap(sleep(1000, val + '-x1'));

			case 2:
				console.log('sub-' + val + '-x1: simple Promise: ' + val + '-x1');

				context$1$0.next = 5;
				return regeneratorRuntime.awrap(sleep(1000, val + '-x2'));

			case 5:
				console.log('sub-' + val + '-x2: simple Promise: ' + val + '-x2');

				return context$1$0.abrupt('return', val);

			case 7:
			case 'end':
				return context$1$0.stop();
		}
	}, null, this);
}

function sleep(msec, val) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, msec, val);
	});
}

