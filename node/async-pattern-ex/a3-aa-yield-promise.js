// aa: yield promise

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

	for (var p in lib)
		if (p.substr(0, 4) === 'proc')
			lib[p] = aa(lib[p]);

	aa(main());

	function *main() {
		lib.log('start**', '');

		var result = {};

		try {
			// 処理A, B, C, Xmをシーケンシャルに実行する。
			result.A = yield lib.procA('A');
			result.B = yield lib.procB('B');
			result.C = yield lib.procC('C');
			for (var x = 0, numX = Math.random() * 3 + 2; x < numX; ++x)
				result['X' + x] = yield lib.procX('X' + x);

			// 処理D, E, F, Ymをパラレルに実行する。
			var generators = [
				function *() { result.D = null; result.D = yield lib.procD('D'); },
				function *() { result.E = null; result.E = yield lib.procE('E'); },
				function *() { result.F = null; result.F = yield lib.procF('F'); }
			];
			for (var y = 0, numY = Math.random() * 3 + 2; y < numY; ++y)
				generators.push(function *(Y) {
					result[Y] = null; result[Y] = yield lib.procY(Y);
				} ('Y' + y));
			yield generators;

			// 処理Gを、シーケンシャルに実行する。
			result.G = yield lib.procG('G');

			// 処理H, I, Jをシーケンシャルに、そして同時に
			// 処理K, L, Mをシーケンシャルに実行する。
			yield [
				function *() {
					result.J = result.I = result.H = null;
					result.H = yield lib.procH('H');
					result.I = yield lib.procI('I');
					result.J = yield lib.procJ('J');
				},
				function *() {
					result.M = result.L = result.K = null;
					result.K = yield lib.procK('K');
					result.L = yield lib.procL('L');
					result.M = yield lib.procM('M');
				}
			];

		} catch (err) {
			lib.error('errZ*', err);
		}

		lib.log('final**', JSON.stringify(result).replace(/\"/g, ''));
	}

})(
	this.lib || require('./lib').lib,
	this.aa || require('aa')
);
