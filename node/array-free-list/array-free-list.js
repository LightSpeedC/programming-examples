// array-free-list

void function () {
	'use strict';

	const ListArray = require('./list-array');

	const N = 1000;
	const EMPTY = ListArray.EMPTY;
	const list = new ListArray();

	for (var i = 0; i < N; ++i)
		list.push(i);

	for (var i = 0; i < N; ++i) {
		var j = (Math.random() * 1000) | 0;
		while (list.get(j) === EMPTY)
			if (++j >= N) j = 0;
		//list.set(j, EMPTY);
		list.clear(j);
	}

	for (var i = 0; i < N; ++i)
		list.push(i);

	console.log(list.getFree());
	console.log(list.getUsed());

}();
