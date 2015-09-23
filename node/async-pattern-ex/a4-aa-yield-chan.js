// aa: yield chan

(function (lib, aa) {
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

	aa(main());

	function *main() {
		lib.log('start**', '');

		var result = {};

		try {

			var chan = aa();

			// 処理A, B, C, Xmをシーケンシャルに実行する。
			lib.procA('A', chan);
			result.A = yield chan;

			lib.procB('B', chan);
			result.B = yield chan;

			lib.procC('C', chan);
			result.C = yield chan;

			for (var x = 0, numX = Math.random() * 3 + 2; x < numX; ++x) {
				lib.procX('X' + x, chan);
				result['X' + x] = yield chan;
			}

			// 処理D, E, F, Ymをパラレルに実行する。
			var channels = {};
			lib.procD('D', channels.D = aa());
			lib.procE('E', channels.E = aa());
			lib.procF('F', channels.F = aa());
			for (var y = 0, numY = Math.random() * 3 + 2; y < numY; ++y)
				lib.procY('Y' + y, channels['Y' + y] = aa());

			var para = yield channels;
			for (var p in para) result[p] = para[p];

			// 処理Gを、シーケンシャルに実行する。
			lib.procG('G', chan);
			result.G = yield chan;

			// 処理H, I, Jをシーケンシャルに、そして同時に
			// 処理K, L, Mをシーケンシャルに実行する。
			yield [
				function *() {
					var chan = aa();
					result.J = result.I = result.H = null;

					lib.procH('H', chan);
					result.H = yield chan;

					lib.procI('I', chan);
					result.I = yield chan;

					lib.procJ('J', chan);
					result.J = yield chan;
				},
				function *() {
					var chan = aa();
					result.M = result.L = result.K = null;

					lib.procK('K', chan);
					result.K = yield chan;

					lib.procL('L', chan);
					result.L = yield chan;

					lib.procM('M', chan);
					result.M = yield chan;
				}
			];

			lib.info('end* ', '');

		} catch (err) {
			lib.error('errZ*', err);
		}

		lib.log('final**', JSON.stringify(result).replace(/\"/g, ''));
	}

})(
	this.lib || require('./lib').lib,
	this.aa || require('aa')
);
