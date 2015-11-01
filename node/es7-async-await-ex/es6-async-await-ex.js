// ES6 Async Await and Babel with npm regenerator.runtime()

	// require('regenerator').runtime()           // babel & browserifyするなら入れておく
	// var aa = require('aa');
	var aa = (this && this.aa) || require('aa');  // 普通は var aa = require('aa'); で良い
	var Promise = aa.Promise;                     // native Promiseがあれば不要

	console.log('main: start');
	aa(main()).then(function (val) {
		console.log('main: finish:', val);
	});

	function *main() {
		var result;
		console.log('main: started');

		// シーケンシャル処理(逐次処理)
		result = yield sleep(2000, 'a1');
		console.log('main-a1: simple Promise: a1 =', result);
		result = yield sleep(2000, 'a2');
		console.log('main-a2: simple Promise: a2 =', result);

		// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
		result = yield [sleep(2000, 'b1'), sleep(2000, 'b2')];
		console.log('main-b: parallel Array:', result);
		result = yield {x:sleep(2000, 'c1'), y:sleep(2000, 'c2')};
		console.log('main-c: parallel Object:', result);
		result = yield Promise.all([sleep(2000, 'd1'), sleep(2000, 'd2')]);
		console.log('main-d: Promise.all([promises,...]): [d1, d2] =', result);

		// generatorのsub()をyieldで呼ぶ
		result = yield sub('e');
		console.log('main-e: sub(e) =', result);

		// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
		// generatorのsub()を並行処理で呼ぶ ... 配列
		result = yield [sub('f1'), sub('f2')];
		console.log('main-f: [generators,...]: [d1, d2] =', result);
		// generatorのsub()を並行処理で呼ぶ ... オブジェクト
		result = yield {x:sub('g1'), y:sub('g2')};
		console.log('main-g: {x:generator, y:...}: {x:g1, y:g2} =', result);

		// 必要ないけど無理やりgeneratorのsub()をpromiseにしてみた
		result = yield Promise.all([aa(sub('h1')), aa(sub('h2'))]);
		console.log('main-f: Promise.all([aa(generator),...]): [h1, h2] =', result);

		return 'return value!';
	}

	function *sub(val) {
		yield sleep(1000, val + '-x1');
		console.log('sub-' + val + '-x1: simple Promise: ' + val + '-x1');

		yield sleep(1000, val + '-x2');
		console.log('sub-' + val + '-x2: simple Promise: ' + val + '-x2');

		return val;
	}

	function sleep(msec, val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, msec, val);
		});
	}
