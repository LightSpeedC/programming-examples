(function () {

	var IS_NODE = typeof process === 'object' && process && typeof process.hrtime === 'function';
	var start = IS_NODE ? process.hrtime() : new Date();

	// 1. Generating sequence
	var a = new Array(1e7);
	for (var index = 0; index < a.length; index++) a[index] = index;

	// 2. Mapping the sequence into another
	var mapped = a.map(n => n * 2);

	// 3. Filtering the sequence
	var filtered = mapped.filter(n => n % 3 == 0);

	// 4. Reducing the sequence
	var result = filtered.reduce((a, b) => a + b);

	// As a result
	console.log(result);

	var delta = IS_NODE ? process.hrtime(start) : new Date() - start;
	console.log((IS_NODE ? (delta[0] * 1e3 + delta[1] / 1e6).toFixed(3) : delta) + ' msec');

})();
