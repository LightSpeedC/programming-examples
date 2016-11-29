'use strict';

// tarai(x: number, y: number, z: number): number;
const tarai = (x, y, z) => x <= y ? y :
	tarai(tarai(x - 1, y, z),
	      tarai(y - 1, z, x),
	      tarai(z - 1, x, y));

bench('takeuchi tarai', tarai, 10, 5, 0);
bench('takeuchi tarai', tarai, 12, 6, 0);
bench('takeuchi tarai', tarai, 14, 7, 0);
bench('takeuchi tarai', tarai, 15, 5, 0);
bench('takeuchi tarai', tarai, 15, 7, 0);

function bench(nm, f, x, y, z) {
	const s = nm + '(' + [x, y, z].join(', ') + ')';
	for (var i = 0; i < 3; ++i)
		console.time(s), console.log(s, f(x, y, z)), console.timeEnd(s);
}
