'use strict';

// tarai(x: number, y: number, z: number): number;
function tarai(x, y, z) {
	return x <= y ? y :
		tarai(tarai(x - 1, y, z),
		      tarai(y - 1, z, x),
		      tarai(z - 1, x, y));
}

var bench = require('./bench');
bench('takeuchi tarai', tarai, 10, 5, 0);
bench('takeuchi tarai', tarai, 12, 6, 0);
bench('takeuchi tarai', tarai, 14, 7, 0);
