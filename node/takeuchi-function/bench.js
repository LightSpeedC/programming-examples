module.exports = bench;

function bench(nm, f, x, y, z) {
	const s = nm + '(' + [x, y, z].join(', ') + ')';
	for (var i = 0; i < 3; ++i)
		console.time(s), console.log(s, f(x, y, z)), console.timeEnd(s);
}
