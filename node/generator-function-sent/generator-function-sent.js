// https://github.com/allenwb/ESideas/blob/master/Generator%20metaproperty.md

'use strict';

function *adder(total) {
	if (typeof total === 'undefined') total = 0;
	let increment = 1;
	let request;
	while (true) {
		switch (request = yield total += increment) {
			case undefined: break;
			case "done": return total;
			default: increment = Number(request);
		}
	}
}

let tally = adder();
tally.next(0.1); // argument will be ignored
tally.next(0.1);
tally.next(0.1);
let last = tally.next("done");
console.log(last.value);  //1.2 instead of 0.3
