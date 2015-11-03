var _marked = [main, sub].map(regeneratorRuntime.mark);

// ES6 Async Await and Babel with npm regenerator.runtime()

// require('regenerator').runtime()           // babel & browserifyするなら入れておく
// var aa = require('aa');
var aa = this && this.aa || require('aa'); // 普通は var aa = require('aa'); で良い
var Promise = aa.Promise; // native Promiseがあれば不要

console.log('main: start');
aa(main()).then(function (val) {
	console.log('main: finish:', val);
});

function main() {
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

				// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
				_context.next = 15;
				return [sleep(200, 'b1'), sleep(100, 'b2'), sleep(300, 'b3')];

			case 15:
				result = _context.sent;

				console.log('main-b : parallel Array :', stringify(result));
				_context.next = 19;
				return { x: sleep(200, 'c1'), y: sleep(100, 'c2'), z: sleep(300, 'c3') };

			case 19:
				result = _context.sent;

				console.log('main-c : parallel Object:', stringify(result));
				_context.next = 23;
				return Promise.all([sleep(200, 'd1'), sleep(100, 'd2'), sleep(300, 'd3')]);

			case 23:
				result = _context.sent;

				console.log('main-d : Promise.all([promises,...]): [d1, d2, d3] =', stringify(result));

				// generatorのsub()をyieldで呼ぶ
				_context.next = 27;
				return sub('e');

			case 27:
				result = _context.sent;

				console.log('main-e : sub(e) =', result);

				// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
				// generatorのsub()を並行処理で呼ぶ ... 配列
				_context.next = 31;
				return [sub('f1'), sub('f2')];

			case 31:
				result = _context.sent;

				console.log('main-f : [generator,...]: [f1, f2] =', stringify(result));
				// generatorのsub()を並行処理で呼ぶ ... オブジェクト
				_context.next = 35;
				return { x: sub('g1'), y: sub('g2') };

			case 35:
				result = _context.sent;

				console.log('main-g : {x:generator, y:...}: {x:g1, y:g2} =', stringify(result));

				// 必要ないけど無理やりgeneratorのsub()をpromiseにしてみた
				_context.next = 39;
				return Promise.all([aa(sub('h1')), aa(sub('h2'))]);

			case 39:
				result = _context.sent;

				console.log('main-h : Promise.all([aa(generator),...]): [h1, h2] =', stringify(result));

				return _context.abrupt('return', 'return value!');

			case 42:
			case 'end':
				return _context.stop();
		}
	}, _marked[0], this);
}

function sub(val) {
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
	}, _marked[1], this);
}

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
