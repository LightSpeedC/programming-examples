function sortArgs() {
	var args = [];
	for (var i = 0; i < arguments.length; ++i)
		args[i] = arguments[i];
	return args.sort().join(',');
}

console.log(sortArgs(1, 3, 5, 2, 4, 6));
