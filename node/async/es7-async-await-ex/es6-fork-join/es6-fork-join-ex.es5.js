var _marked = [main].map(regeneratorRuntime.mark);

// ES6 fork and join.

// require('regenerator').runtime()           // babel & browserifyするなら入れておく
// var aa = require('aa');
var aa = this && this.aa || require('aa'); // 普通は var aa = require('aa'); で良い
var Channel = aa.Channel;

console.log('main: start');
aa(main()).then(function (val) {
	console.log('main: finish:', val);
});

function main() {
	var result, chan;
	return regeneratorRuntime.wrap(function main$(_context3) {
		while (1) switch (_context3.prev = _context3.next) {
			case 0:
				console.log('main: started');

				chan = Channel();
				_context3.next = 4;
				return [regeneratorRuntime.mark(function _callee() {
					return regeneratorRuntime.wrap(function _callee$(_context) {
						while (1) switch (_context.prev = _context.next) {
							case 0:
								_context.t0 = console;
								_context.next = 3;
								return sleep(100, 'a1');

							case 3:
								_context.t1 = _context.sent;

								_context.t0.log.call(_context.t0, 'main:', _context.t1);

								_context.t2 = console;
								_context.next = 8;
								return sleep(200, 'a2');

							case 8:
								_context.t3 = _context.sent;

								_context.t2.log.call(_context.t2, 'main:', _context.t3);

								chan('a1-a2');
								_context.t4 = console;
								_context.next = 14;
								return sleep(300, 'a3');

							case 14:
								_context.t5 = _context.sent;

								_context.t4.log.call(_context.t4, 'main:', _context.t5);

							case 16:
							case 'end':
								return _context.stop();
						}
					}, _callee, this);
				}), regeneratorRuntime.mark(function _callee2() {
					return regeneratorRuntime.wrap(function _callee2$(_context2) {
						while (1) switch (_context2.prev = _context2.next) {
							case 0:
								_context2.t0 = console;
								_context2.next = 3;
								return sleep(200, 'b1');

							case 3:
								_context2.t1 = _context2.sent;

								_context2.t0.log.call(_context2.t0, 'main:', _context2.t1);

								_context2.t2 = console;
								_context2.next = 8;
								return chan;

							case 8:
								_context2.t3 = _context2.sent;

								_context2.t2.log.call(_context2.t2, 'main:', _context2.t3, '-> b');

								_context2.t4 = console;
								_context2.next = 13;
								return sleep(200, 'b2');

							case 13:
								_context2.t5 = _context2.sent;

								_context2.t4.log.call(_context2.t4, 'main:', _context2.t5);

							case 15:
							case 'end':
								return _context2.stop();
						}
					}, _callee2, this);
				})];

			case 4:
				return _context3.abrupt('return', 'return value!');

			case 5:
			case 'end':
				return _context3.stop();
		}
	}, _marked[0], this);
}

function sleep(msec, val) {
	return new Promise(function (resolve, reject) {
		setTimeout(resolve, msec, val);
	});
}
