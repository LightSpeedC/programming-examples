// ES7 Async Await and Babel with npm regenerator.runtime()

	require('regenerator').runtime();

	console.log('main: start');
	main().then(function (val) {
		console.log('main: finish:', val);
	});

	async function main() {
		var result;
		console.log('main: started');

		// シーケンシャル処理(逐次処理)
		result = await sleep(2000, 'a1');
		console.log('main-a1: simple Promise: a1 =', result);
		result = await sleep(2000, 'a2');
		console.log('main-a2: simple Promise: a2 =', result);

		// パラレル処理(並行処理)
		result = await Promise.all([sleep(3000, 'b1'), sleep(3000, 'b2')]);
		console.log('main-b: Promise.all([promises]): [b1, b2] =', result);

		// asyncなsub()をawaitで呼ぶ
		result = await sub('c');
		console.log('main-c: sub(c) =', result);
		// asyncなsub()を並行処理で呼ぶ
		result = await Promise.all([sub('d1'), sub('d2')]);
		console.log('main-d: Promise.all([promises]): [d1, d2] =', result);

		// ここは使わない
		result = await [sleep(3000, 'e1'), sleep(3000, 'e2')];
		console.log('main-e: Array does not work:', result);
		result = await {x:sleep(3000, 'f1'), y:sleep(3000, 'f2')};
		console.log('main-f: Object does not work:', result);

		return 'return value!';
	}

	async function sub(val) {
		await sleep(1000, val + '-x1');
		console.log('sub-' + val + '-x1: simple Promise: ' + val + '-x1');

		await sleep(1000, val + '-x2');
		console.log('sub-' + val + '-x2: simple Promise: ' + val + '-x2');

		return val;
	}

	function sleep(msec, val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, msec, val);
		});
	}
