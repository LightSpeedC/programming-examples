// callback

(function () {
	'use strict';

	// FLOW:
	// start -->*--> procA --->*--> procC --> procA --> procB --> procX --> end
	//          +--> procB --->+
	//          +--> procX0 -->+
	//          +--> procX1 -->+
	//          |    . . .     |
	//          +--> procXm -->+

	var lib = require('./lib').lib;

	// メインを呼び出す
	main();

	// メイン
	function main() {
		lib.log('start**', '');

		var n = 0, result = [];

		n++;
		lib.procA('A', callbackABX);
		n++;
		lib.procB('B', callbackABX);
		for (var x = 0, m = Math.random() * 3 + 2; x < m; ++x) {
			n++;
			lib.procX('X' + x, callbackABX);
		}

		function callbackABX(err, val) {
			if (!err) {
				result.push(val);
				if (--n === 0)
					lib.procC('C:' + result.join(','), callbackC);
			}
			else {
				lib.error('err1*', err);

				// 一度だけ最後の処理を呼ぶ
				if (n) {
					n = 0;
					callbackC(err, result);
				}
				return;
			}
		}

		function callbackC(err, val) {
			if (err) lib.error('err2*', err);
			else lib.info('end* ', val);

			lib.log('final**', '');
		}
	}

})();
