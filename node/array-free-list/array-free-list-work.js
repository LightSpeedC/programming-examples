// array-free-list-work

void function () {
	'use strict';

	const used = [];
	const free = [];
	const N = 1000;
	const NOVAL = -1;

	for (var i = 0; i < N; ++i)
		used.push(i);

	for (var i = 0; i < N; ++i) {
		var j = (Math.random() * 1000) | 0;
		while (used[j] === NOVAL)
			if (++j >= N) j = 0;
		used[j] = NOVAL;
		free.push(j);
	}

	for (var i = 0; i < N; ++i) {
		var j = free.pop();
		if (used[j] !== NOVAL)
			throw new RangeError('eh!? idx=' + j);
		used[j] = i;
	}

	console.log(free);
	console.log(used);

}();
