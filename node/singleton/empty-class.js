void function () {
	'use strict';

	const EMPTY = new (class Empty1 {});

	EMPTY.constructor.prototype.constructor =
	class Empty2 {constructor() {return EMPTY}};

	const e1 = new EMPTY.constructor;
	console.log(e1, e1 === EMPTY, EMPTY);

	//const e2 = EMPTY.constructor();
//        class Empty2 {constructor() {return EMPTY}}
//                                 ^

//TypeError: Class constructors cannot be invoked without 'new'
//    at new Empty2 (empty-class.js)
}();
