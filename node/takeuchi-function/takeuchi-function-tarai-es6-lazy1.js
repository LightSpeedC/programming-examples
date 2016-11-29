'use strict';

// tarai(x: number, y: number, z: number | function): number;
const tarai = (x, y, z) => x <= y ? y :
	((typeof z === 'function' ? z = z() : z),
	tarai(tarai(x - 1, y, z),
	      tarai(y - 1, z, x),
	      () => tarai(z - 1, x, y)));

bench('takeuchi tarai', tarai, 10, 5, 0);
bench('takeuchi tarai', tarai, 12, 6, 0);
bench('takeuchi tarai', tarai, 14, 7, 0);
bench('takeuchi tarai', tarai, 15, 5, 0);
bench('takeuchi tarai', tarai, 16, 8, 0);
bench('takeuchi tarai', tarai, 100, 50, 0);
bench('takeuchi tarai', tarai, 1000, 500, 0);
bench('takeuchi tarai', tarai, 5000, 2500, 0);
bench('takeuchi tarai', tarai, 10000, 5000, 0);
bench('takeuchi tarai', tarai, 14000, 7000, 0);
bench('takeuchi tarai', tarai, 16000, 8000, 0);
bench('takeuchi tarai', tarai, 18000, 9000, 0);

function bench(nm, f, x, y, z) {
	const s = nm + '(' + [x, y, z].join(', ') + ')';
	for (var i = 0; i < 3; ++i)
		console.time(s), console.log(s, f(x, y, z)), console.timeEnd(s);
}
