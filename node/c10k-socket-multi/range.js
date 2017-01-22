module.exports = range;

function range(n, m) {
	if (arguments.length === 1)
		m = n, n = 0;
	const a = [];
	for (let i = n; i < m; ++i)
		a.push(i);
	return a;
}
