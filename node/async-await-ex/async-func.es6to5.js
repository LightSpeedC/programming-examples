"use strict";

if (undefined === undefined) require('babel/polyfill');

function dox(num) {
	return regeneratorRuntime.async(function dox$(context$1$0) {
		while (1) switch (context$1$0.prev = context$1$0.next) {
			case 0:
				console.log(num);

				if (!(num > 0)) {
					context$1$0.next = 5;
					break;
				}

				context$1$0.next = 4;
				return regeneratorRuntime.awrap(dox(--num));

			case 4:
				return context$1$0.abrupt("return", context$1$0.sent);

			case 5:
				return context$1$0.abrupt("return", num);

			case 6:
			case "end":
				return context$1$0.stop();
		}
	}, null, this);
}

dox(10);
console.log("hello");

