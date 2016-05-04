void function () {
	'use strict';

	const EMPTY = new (function Empty() {});
	EMPTY.constructor.prototype.constructor = function Empty() {return EMPTY};

	const e1 = new EMPTY.constructor;
	console.log(e1, e1 === EMPTY, EMPTY);

	const e2 = EMPTY.constructor();
	console.log(e2, e2 === EMPTY, EMPTY);
}();
