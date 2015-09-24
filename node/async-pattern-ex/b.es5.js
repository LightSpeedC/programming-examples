'use strict';

(function (global) {
	var marked1$0 = [g].map(regeneratorRuntime.mark);

	var aa = require('aa');
	function g() {
		return regeneratorRuntime.wrap(function g$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.next = 2;
					return 1;

				case 2:
					context$2$0.next = 4;
					return 2;

				case 4:
					context$2$0.next = 6;
					return 3;

				case 6:
					return context$2$0.abrupt('return', 10);

				case 7:
				case 'end':
					return context$2$0.stop();
			}
		}, marked1$0[0], this);
	}
	var gg = g();
	console.log(typeof g, g.constructor.name);
	console.log(typeof gg, gg.constructor.name);
	console.log(gg.__proto__.constructor.name);
	console.log(gg.__proto__.__proto__.constructor.name);
	console.log(gg.__proto__.__proto__.__proto__.constructor.name);
	console.log(gg);
	console.log(gg.next());
	console.log(gg.next());
	console.log(gg.next());
	console.log(gg.next());
})(typeof global ? global : typeof window ? window : typeof self ? self : undefined);

