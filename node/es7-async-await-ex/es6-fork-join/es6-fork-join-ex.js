// ES6 fork and join.

	// require('regenerator').runtime()           // babel & browserifyするなら入れておく
	// var aa = require('aa');
	var aa = (this && this.aa) || require('aa');  // 普通は var aa = require('aa'); で良い
	var Channel = aa.Channel;

	console.log('main: start');
	aa(main()).then(function (val) {
		console.log('main: finish:', val);
	});

	function *main() {
		var result;
		console.log('main: started');

		var chan = Channel();

		yield [
			function *() {
				console.log('main:', yield sleep(100, 'a1'));
				console.log('main:', yield sleep(200, 'a2'));
				chan('a1-a2');  //----------------------------------+
				console.log('main:', yield sleep(300, 'a3')); //    |
			},                                                //    |
			function *() {                                    //    |
				console.log('main:', yield sleep(200, 'b1')); //    |
				console.log('main:', yield chan, '-> b'); // <------+
				console.log('main:', yield sleep(200, 'b2'));
			}
		];

		return 'return value!';
	}

	function sleep(msec, val) {
		return new Promise(function (resolve, reject) {
			setTimeout(resolve, msec, val);
		});
	}
