function sortArgs(...args) {
	return args.sort().join(',');
}

console.log(sortArgs(1, 3, 5, 2, 4, 6));
