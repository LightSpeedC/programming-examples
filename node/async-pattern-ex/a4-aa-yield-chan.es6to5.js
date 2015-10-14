// aa: yield chan

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
	aa(main());
	var Channel = aa.Channel;

	function main() {
		var result, chan, x, numX, channels, y, numY, para, p;
		return regeneratorRuntime.wrap(function main$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					lib.log('start**', '');

					result = {};
					context$2$0.prev = 2;
					chan = Channel();

					// 処理A, B, C, Xmをシーケンシャルに実行する。
					lib.procA('A', chan);
					context$2$0.next = 7;
					return chan;

				case 7:
					result.A = context$2$0.sent;

					lib.procB('B', chan);
					context$2$0.next = 11;
					return chan;

				case 11:
					result.B = context$2$0.sent;

					lib.procC('C', chan);
					context$2$0.next = 15;
					return chan;

				case 15:
					result.C = context$2$0.sent;
					x = 0, numX = Math.random() * 3 + 2;

				case 17:
					if (!(x < numX)) {
						context$2$0.next = 25;
						break;
					}

					lib.procX('X' + x, chan);
					context$2$0.next = 21;
					return chan;

				case 21:
					result['X' + x] = context$2$0.sent;

				case 22:
					++x;
					context$2$0.next = 17;
					break;

				case 25:
					channels = {};

					lib.procD('D', channels.D = aa());
					lib.procE('E', channels.E = aa());
					lib.procF('F', channels.F = aa());
					for (y = 0, numY = Math.random() * 3 + 2; y < numY; ++y) lib.procY('Y' + y, channels['Y' + y] = aa());

					context$2$0.next = 32;
					return channels;

				case 32:
					para = context$2$0.sent;

					for (p in para) result[p] = para[p];

					// 処理Gを、シーケンシャルに実行する。
					lib.procG('G', chan);
					context$2$0.next = 37;
					return chan;

				case 37:
					result.G = context$2$0.sent;
					context$2$0.next = 40;
					return [regeneratorRuntime.mark(function callee$2$0() {
						var chan;
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									chan = Channel();

									result.J = result.I = result.H = null;

									lib.procH('H', chan);
									context$3$0.next = 5;
									return chan;

								case 5:
									result.H = context$3$0.sent;

									lib.procI('I', chan);
									context$3$0.next = 9;
									return chan;

								case 9:
									result.I = context$3$0.sent;

									lib.procJ('J', chan);
									context$3$0.next = 13;
									return chan;

								case 13:
									result.J = context$3$0.sent;

								case 14:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					}), regeneratorRuntime.mark(function callee$2$0() {
						var chan;
						return regeneratorRuntime.wrap(function callee$2$0$(context$3$0) {
							while (1) switch (context$3$0.prev = context$3$0.next) {
								case 0:
									chan = Channel();

									result.M = result.L = result.K = null;

									lib.procK('K', chan);
									context$3$0.next = 5;
									return chan;

								case 5:
									result.K = context$3$0.sent;

									lib.procL('L', chan);
									context$3$0.next = 9;
									return chan;

								case 9:
									result.L = context$3$0.sent;

									lib.procM('M', chan);
									context$3$0.next = 13;
									return chan;

								case 13:
									result.M = context$3$0.sent;

								case 14:
								case 'end':
									return context$3$0.stop();
							}
						}, callee$2$0, this);
					})];

				case 40:

					lib.info('end* ', '');

					context$2$0.next = 46;
					break;

				case 43:
					context$2$0.prev = 43;
					context$2$0.t0 = context$2$0['catch'](2);

					lib.error('errZ*', context$2$0.t0);

				case 46:

					lib.log('final**', JSON.stringify(result).replace(RegExp('"', 'g'), ''));

				case 47:
				case 'end':
					return context$2$0.stop();
			}
		}, marked1$0[0], this, [[2, 43]]);
	}
})((undefined || window).lib || require('./lib').lib, (undefined || window).aa || require('aa'));

// 処理D, E, F, Ymをパラレルに実行する。

// 処理H, I, Jをシーケンシャルに、そして同時に
// 処理K, L, Mをシーケンシャルに実行する。

