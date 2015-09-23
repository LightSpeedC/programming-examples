// callback

(function (lib) {
	'use strict';

	// FLOW:
	// start --> procA  --> procB  --> procC -->
	//       --> procX0 --> procX1 --> . . . --> procXm -->
	//       -->*--> procD --->*--> procG -->*--> procH --> procI --> procJ -->*--> end
	//          +--> procE --->+             +--> procK --> procL --> procM -->+ 
	//          +--> procF --->+
	//          +--> procY0 -->+
	//          +--> procY1 -->+
	//          |    . . .     |
	//          +--> procYm -->+

	// メインを呼び出す
	main();

	// メイン
	function main() {
		lib.log('start**', '');

		var x = 0, numX = 0;
		var result = {};
		var n = 0;

		// 処理A, B, C, Xmをシーケンシャルに実行する。
		lib.procA('A', function (err, val) {
			if (err) return callbackZ(err);
			result.A = val;

			lib.procB('B', function (err, val) {
				if (err) return callbackZ(err);
				result.B = val;

				lib.procC('C', function (err, val) {
					if (err) return callbackZ(err);
					result.C = val;

					numX = Math.random() * 3 + 2;
					x = 0;
					lib.procX('X' + x, callbackX);
				});
			});
		});

		function callbackX(err, val) {
			if (err) return callbackZ(err);
			result['X' + x] = val;

			++x;
			if (x < numX) return lib.procX('X' + x, callbackX);

			// 処理D, E, F, Ymをパラレルに実行する。
			n = 3;
			result.F = result.E = result.D = null;
			lib.procD('D', function (err, val) {
				if (!err) result.D = val;
				callbackDEFY(err, result);
			});
			lib.procE('E', function (err, val) {
				if (!err) result.E = val;
				callbackDEFY(err, result);
			});
			lib.procF('F', function (err, val) {
				if (!err) result.F = val;
				callbackDEFY(err, result);
			});
			for (var y = 0, numY = Math.random() * 3 + 2; y < numY; ++y)
				(function (Y) {
					++n;
					result[Y] = null;
					lib.procY(Y, function (err, val) {
						if (!err) result[Y] = val;
						callbackDEFY(err, result);
					});
				})('Y' + y);
		}

		function callbackDEFY(err, val) {
			if (err) {
				// 一度だけ最後の処理を呼ぶ
				if (n > 0) callbackZ(err);
				n = 0;
				return;
			}

			if (--n === 0) {
				// 全て成功したので次の処理を呼ぶ
				lib.procG('G', function (err, val) {
					if (!err) result.G = val;
					callbackG(err, result);
				});
			}
		}

		function callbackG(err, val) {
			// 処理H, I, Jをシーケンシャルに、そして同時に
			// 処理K, L, Mをシーケンシャルに実行する。
			var n = 2;

			result.J = result.I = result.H = null;
			lib.procH('H', function (err, val) {
				if (err) return callbackZ(err);
				result.H = val;

				lib.procI('I', function (err, val) {
					if (err) return callbackZ(err);
					result.I = val;

					lib.procJ('J', function (err, val) {
						if (err) return callbackZ(err);
						result.J = val;

						callbackJM();
					});
				});
			});

			result.M = result.L = result.K = null;
			lib.procK('K', function (err, val) {
				if (err) return callbackZ(err);
				result.K = val;

				lib.procL('L', function (err, val) {
					if (err) return callbackZ(err);
					result.L = val;

					lib.procM('M', function (err, val) {
						if (err) return callbackZ(err);
						result.M = val;

						callbackJM();
					});
				});
			});

			function callbackJM() {
				if (--n === 0) callbackZ(null);
			}

		}

		function callbackZ(err, val) {
			if (err) lib.error('errZ*', err);
			else     lib.info('end* ', '');

			lib.log('final**', JSON.stringify(result).replace(RegExp('"', 'g'), ''));
		}
	}

})(this.lib || require('./lib').lib);
