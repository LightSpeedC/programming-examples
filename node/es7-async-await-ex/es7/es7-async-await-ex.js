// ES7 Async Await and Babel with npm regenerator.runtime()
	'use strict';

	require('babel-polyfill'); // おまじない
	//require('regenerator').runtime();

	console.log('main: start');
	main().then(function (val) {
		console.log('main: finish:', val);
	});

	async function main() {
		var result;
		console.log('main: started');

		// シーケンシャル処理(逐次処理)
		result = await sleep(200, 'a1');
		console.log('main-a1: sleep: a1 =', result);
		result = await sleep(100, 'a2');
		console.log('main-a2: sleep: a2 =', result);
		result = await sleep(300, 'a3');
		console.log('main-a3: sleep: a3 =', result);

		// パラレル処理(並行処理)
		result = await Promise.all([sleep(200, 'b1'), sleep(100, 'b2'), sleep(300, 'b3')]);
		console.log('main-b : Promise.all([promises]): [b1, b2, b3] =', stringify(result));

		// asyncなsub()をawaitで呼ぶ
		result = await sub('c');
		console.log('main-c : sub(c) =', result);
		// asyncなsub()を並行処理で呼ぶ
		result = await Promise.all([sub('d1'), sub('d2')]);
		console.log('main-d : Promise.all([promises]): [d1, d2] =', stringify(result));

		// ここは使わない
		result = await [sleep(200, 'e1'), sleep(100, 'e2')];
		console.log('main-e : Array does not work :', stringify(result));
		result = await {x:sleep(200, 'f1'), y:sleep(100, 'f2')};
		console.log('main-f : Object does not work:', stringify(result));

		return 'return value!';
	}

	async function sub(val) {
		await sleep(100, val + '-x1');
		console.log('sub-' + val + '-x1: sleep: ' + val + '-x1');

		await sleep(100, val + '-x2');
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
