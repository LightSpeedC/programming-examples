void function () {
	'use strict';

	const obj = {x:123, y:'str', z:{a:1, b:2}};

	console.log(obj);
	console.log(Object.keys(obj));

	if (!Object.values) {
		console.log('Object.values - set');
		Object.values = object => Object.keys(object).map(key => object[key]);
	}
	console.log(Object.values(obj));

	if (!Object.entries) {
		console.log('Object.entries - set');
		Object.entries = object => Object.keys(object).map(key => [key, object[key]]);
	}
	console.log(Object.entries(obj));
}();
