function Range(first, last, excl) {
	var a = [];
	for (var i = first, n = excl ? last : last - 1; i <= n; ++i)
		a.push(i);
	return a;
}

new Range(1, 10, true).forEach(i => console.log(i));
