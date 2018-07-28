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
		result = yield sleep(200, 'a1');
		console.log('main-a1: sleep: a1 =', result);
		result = yield sleep(100, 'a2');
		console.log('main-a2: sleep: a2 =', result);
		result = yield sleep(300, 'a3');
		console.log('main-a3: sleep: a3 =', result);

		// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
		result = yield [sleep(200, 'b1'), sleep(100, 'b2'), sleep(300, 'b3')];
		console.log('main-b : parallel Array :', stringify(result));
		result = yield {x:sleep(200, 'c1'), y:sleep(100, 'c2'), z:sleep(300, 'c3')};
		console.log('main-c : parallel Object:', stringify(result));
		result = yield Promise.all([sleep(200, 'd1'), sleep(100, 'd2'), sleep(300, 'd3')]);
		console.log('main-d : Promise.all([promises,...]): [d1, d2, d3] =', stringify(result));

		// generatorのsub()をyieldで呼ぶ
		result = yield sub('e');
		console.log('main-e : sub(e) =', result);

		// パラレル処理(並行処理) ... 配列やオブジェクトで結果を取得
		// generatorのsub()を並行処理で呼ぶ ... 配列
		result = yield [sub('f1'), sub('f2')];
		console.log('main-f : [generator,...]: [f1, f2] =', stringify(result));
		// generatorのsub()を並行処理で呼ぶ ... オブジェクト
		result = yield {x:sub('g1'), y:sub('g2')};
		console.log('main-g : {x:generator, y:...}: {x:g1, y:g2} =', stringify(result));

		// 必要ないけど無理やりgeneratorのsub()をpromiseにしてみた
		result = yield Promise.all([aa(sub('h1')), aa(sub('h2'))]);
		console.log('main-h : Promise.all([aa(generator),...]): [h1, h2] =', stringify(result));

		return 'return value!';
	}

	function *sub(val) {
		yield sleep(100, val + '-x1');
		console.log('sub-' + val + '-x1: sleep: ' + val + '-x1');

		yield sleep(100, val + '-x2');
		console.log('sub-' + val + '-x2: sleep: ' + val + '-x2');

		return val;
	}

	function sleep(msec, val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, msec, val);
		});
	}

	function stringify(object) {
		var str = '';
		if (object instanceof Array) {
			for (var i = 0, n = object.length; i < n; ++i)
				str += (str ? ', ' : '') + object[i]
			return '[' + str + ']';
		}
		else {
			for (var key in object)
				str += (str ? ', ' : '') + key + ':' + object[key]
			return '{' + str + '}';
		}
	}
