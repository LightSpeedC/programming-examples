// aa: yield promise

'use strict';

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

	var marked1$0 = [main].map(regeneratorRuntime.mark);
	for (var p in lib) if (p.substr(0, 4) === 'proc') lib[p] = aa(lib[p]);

	aa(main());

	function main() {
		var result, x, numX, generators, y, numY;
		return regeneratorRuntime.wrap(function main$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					lib.log('start**', '');

					result = {};
					context$2$0.prev = 2;
					context$2$0.next = 5;
					return lib.procA('A');

				case 5:
					result.A = context$2$0.sent;
					context$2$0.next = 8;
					return lib.procB('B');

				case 8:
					result.B = context$2$0.sent;
					context$2$0.next = 11;
					return lib.procC('C');

				case 11:
					result.C = context$2$0.sent;
					x = 0, numX = Math.random() * 3 + 2;

				case 13:
					if (!(x < numX)) {
						context$2$0.next = 20;
						break;
					}

					context$2$0.next = 16;
					return lib.procX('X' + x);

				case 16:
					result['X' + x] = context$2$0.sent;

				case 17:
					++x;
					context$2$0.next = 13;
					break;

				case 20:
					generators = [regeneratorRuntime.mark(function callee$2$0() {
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									result.D = null;context$3$0.next = 3;
									return lib.procD('D');

								case 3:
									result.D = context$3$0.sent;

								case 4:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					}), regeneratorRuntime.mark(function callee$2$0() {
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									result.E = null;context$3$0.next = 3;
									return lib.procE('E');

								case 3:
									result.E = context$3$0.sent;

								case 4:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					}), regeneratorRuntime.mark(function callee$2$0() {
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									result.F = null;context$3$0.next = 3;
									return lib.procF('F');

								case 3:
									result.F = context$3$0.sent;

								case 4:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					})];

					for (y = 0, numY = Math.random() * 3 + 2; y < numY; ++y) generators.push(regeneratorRuntime.mark(function callee$2$0(Y) {
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									result[Y] = null;context$3$0.next = 3;
									return lib.procY(Y);

								case 3:
									result[Y] = context$3$0.sent;

								case 4:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					})('Y' + y));
					context$2$0.next = 24;
					return generators;

				case 24:
					context$2$0.next = 26;
					return lib.procG('G');

				case 26:
					result.G = context$2$0.sent;
					context$2$0.next = 29;
					return [regeneratorRuntime.mark(function callee$2$0() {
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									result.J = result.I = result.H = null;
									context$3$0.next = 3;
									return lib.procH('H');

								case 3:
									result.H = context$3$0.sent;
									context$3$0.next = 6;
									return lib.procI('I');

								case 6:
									result.I = context$3$0.sent;
									context$3$0.next = 9;
									return lib.procJ('J');

								case 9:
									result.J = context$3$0.sent;

								case 10:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					}), regeneratorRuntime.mark(function callee$2$0() {
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									result.M = result.L = result.K = null;
									context$3$0.next = 3;
									return lib.procK('K');

								case 3:
									result.K = context$3$0.sent;
									context$3$0.next = 6;
									return lib.procL('L');

								case 6:
									result.L = context$3$0.sent;
									context$3$0.next = 9;
									return lib.procM('M');

								case 9:
									result.M = context$3$0.sent;

								case 10:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					})];

				case 29:
					context$2$0.next = 34;
					break;

				case 31:
					context$2$0.prev = 31;
					context$2$0.t0 = context$2$0['catch'](2);

					lib.error('errZ*', context$2$0.t0);

				case 34:

					lib.log('final**', JSON.stringify(result).replace(RegExp('"', 'g'), ''));

				case 35:
				case 'end':
					return context$2$0.stop();
			}
		}, marked1$0[0], this, [[2, 31]]);
	}
})((undefined || window).lib || require('./lib').lib, (undefined || window).aa || require('aa'));

// 処理A, B, C, Xmをシーケンシャルに実行する。

// 処理D, E, F, Ymをパラレルに実行する。

// 処理Gを、シーケンシャルに実行する。

// 処理H, I, Jをシーケンシャルに、そして同時に
// 処理K, L, Mをシーケンシャルに実行する。

