// ES6 executors.

	var aa = require('aa'), Channel = aa.Channel;
	var Executors = require('executors');

	aa(function *main() {

		var parallel9 = [];
		console.time('parallel9');
		for (var i = 0; i < 9; ++i)
			parallel9.push(sleep(100, i));
		yield parallel9;
		console.timeEnd('parallel9');

		var executors3 = Executors(3);
		var parallel3 = [];
		console.time('parallel3');
		for (var i = 0; i < 9; ++i)
			parallel3.push(executors3(sleep, 100, i));
		yield parallel3;
		console.timeEnd('parallel3');
	});

	function sleep(msec, val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, msec, val);
		});
	}
