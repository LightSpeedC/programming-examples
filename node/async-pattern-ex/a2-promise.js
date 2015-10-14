// promise

(function (lib, Promise) {
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

	function promisify(fn) {
		return function () {
			var args = arguments;
			return new Promise(function (resolve, reject) {
				args[args.length++] = function (err, val) {
					err ? reject(err) : resolve(val);
				};
				fn.apply(null, args);
			});
		}
	}

	// procで始まる関数をpromisifyを使用してPromise化する。
	for (var p in lib)
		if (p.substr(0, 4) === 'proc')
			lib[p] = promisify(lib[p]);

	main();

	function main() {
		lib.log('start**', '');
	
		var result = {};

		// 処理A, B, C, Xmをシーケンシャルに実行する。
		lib.procA('A')
		.then(
			function (val) {
				result.A = val;
				return lib.procB('B');
			})
		.then(
			function (val) {
				result.B = val;
				return lib.procC('C');
			})
		.then(
			function (val) {
				result.C = val;

				var x = 0, numX = Math.random() * 3 + 2;

				return lib.procX('X' + x).then(callbackX);

				function callbackX(val) {
					result['X' + x] = val;
					++x;
					if (x < numX) return lib.procX('X' + x).then(callbackX);

					// 処理D, E, F, Ymをパラレルに実行する。
					result.F = result.E = result.D = null;
					var promises = [
						lib.procD('D').then(setResult('D')),
						lib.procE('E').then(setResult('E')),
						lib.procF('F').then(setResult('F'))
					];
					for (var y = 0, numY = Math.random() * 3 + 2; y < numY; ++y)
						(function (Y) {
							result[Y] = null;
							promises.push(lib.procY(Y).then(setResult(Y)));
						})('Y' + y);

					function setResult(Z) {
						return function (val) { return result[Z] = val; };
					}

					return Promise.all(promises);
				}
			})

			// 処理Gを、シーケンシャルに実行する。
			.then(
				function () { return lib.procG('G'); })

			// 処理H, I, Jをシーケンシャルに、そして同時に
			// 処理K, L, Mをシーケンシャルに実行する。
			.then(
				function () {
					result.J = result.I = result.H = null;
					result.M = result.L = result.K = null;
					return Promise.all([
						lib.procH('H')
						.then(
							function (val) {
								result.H = val;
								return lib.procI('I');
							})
						.then(
							function (val) {
								result.I = val;
								return lib.procJ('J');
							})
						.then(
							function (val) {
								result.J = val;
							}),
						lib.procK('K')
						.then(
							function (val) {
								result.K = val;
								return lib.procL('L');
							})
						.then(
							function (val) {
								result.L = val;
								return lib.procM('M');
							})
						.then(
							function (val) {
								result.M = val;
							})
					]);

				})

			.then(
				function () { lib.info('end* ', ''); },
				function (err) { lib.error('errZ*', err); })
			.then(
				function () { lib.log('final**', JSON.stringify(result).replace(RegExp('"', 'g'), '')); });

	}

})(
	this.lib || require('./lib').lib,
	this.PromiseThunk || require('promise-thunk')
);
