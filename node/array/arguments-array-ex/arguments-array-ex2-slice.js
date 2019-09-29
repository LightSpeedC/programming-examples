function sortArgs() {
	return [].slice.call(arguments).sort().join(',');
}

console.log(sortArgs(1, 3, 5, 2, 4, 6));
