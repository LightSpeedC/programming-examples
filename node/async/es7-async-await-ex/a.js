	'use strict';

	main();

	async function main() {
		console.log('a1');
		await sleep(100, 'a');
		console.log('a9');
	}

	function sleep(msec, val) {
		console.log('sleep', val);
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, msec, val);
		});
	}
