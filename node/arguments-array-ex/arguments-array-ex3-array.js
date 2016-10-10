function sortArgs() {
	var args = arguments.length === 1 ?
		[arguments[0]] : Array.apply(null, arguments);
	return args.sort().join(',');
}

console.log(sortArgs(1, 3, 5, 2, 4, 6));
