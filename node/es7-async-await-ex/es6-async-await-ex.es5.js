// ES6 Async Await and Babel with npm regenerator.runtime()

// var aa = require('aa');
'use strict';

var marked0$0 = [main, sub].map(regeneratorRuntime.mark);
var aa = undefined && undefined.aa || require('aa');
var Promise = aa.Promise;

console.log('main: start');
aa(main()).then(function (val) {
	console.log('main: finish:', val);
});

function main() {
	var result;
	return regeneratorRuntime.wrap(function main$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				console.log('main: started');

				// シーケンシャル処理(逐次処理)
				context$1$0.next = 3;
				return sleep(2000, 'a1');

			case 3:
				result = context$1$0.sent;

				console.log('main-a1: simple Promise: a1 =', result);
				context$1$0.next = 7;
				return sleep(2000, 'a2');

			case 7:
				result = context$1$0.sent;

				console.log('main-a2: simple Promise: a2 =', result);

				// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
				context$1$0.next = 11;
				return [sleep(2000, 'b1'), sleep(2000, 'b2')];

			case 11:
				result = context$1$0.sent;

				console.log('main-b: parallel Array:', result);
				context$1$0.next = 15;
				return { x: sleep(2000, 'c1'), y: sleep(2000, 'c2') };

			case 15:
				result = context$1$0.sent;

				console.log('main-c: parallel Object:', result);
				context$1$0.next = 19;
				return Promise.all([sleep(2000, 'd1'), sleep(2000, 'd2')]);

			case 19:
				result = context$1$0.sent;

				console.log('main-d: Promise.all([promises,...]): [d1, d2] =', result);

				// generatorのsub()をyieldで呼ぶ
				context$1$0.next = 23;
				return sub('e');

			case 23:
				result = context$1$0.sent;

				console.log('main-e: sub(e) =', result);

				// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
				// generatorのsub()を並行処理で呼ぶ ... 配列
				context$1$0.next = 27;
				return [sub('f1'), sub('f2')];

			case 27:
				result = context$1$0.sent;

				console.log('main-f: [generators,...]: [d1, d2] =', result);
				// generatorのsub()を並行処理で呼ぶ ... オブジェクト
				context$1$0.next = 31;
				return { x: sub('g1'), y: sub('g2') };

			case 31:
				result = context$1$0.sent;

				console.log('main-g: {x:generator, y:...}: {x:g1, y:g2} =', result);

				// 必要ないけど無理やりgeneratorのsub()をpromiseにしてみた
				context$1$0.next = 35;
				return Promise.all([aa(sub('h1')), aa(sub('h2'))]);

			case 35:
				result = context$1$0.sent;

				console.log('main-f: Promise.all([aa(generator),...]): [h1, h2] =', result);

				return context$1$0.abrupt('return', 'return value!');

			case 38:
			case 'end':
				return context$1$0.stop();
		}
	}, marked0$0[0], this);
}

function sub(val) {
	return regeneratorRuntime.wrap(function sub$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				context$1$0.next = 2;
				return sleep(1000, val + '-x1');

			case 2:
				console.log('sub-' + val + '-x1: simple Promise: ' + val + '-x1');

				context$1$0.next = 5;
				return sleep(1000, val + '-x2');

			case 5:
				console.log('sub-' + val + '-x2: simple Promise: ' + val + '-x2');

				return context$1$0.abrupt('return', val);

			case 7:
			case 'end':
				return context$1$0.stop();
		}
	}, marked0$0[1], this);
}

function sleep(msec, val) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, msec, val);
	});
}

