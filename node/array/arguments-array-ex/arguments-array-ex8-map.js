function sortArgs() {
	return [].map.call(arguments, x => x).sort().join(',');
}

console.log(sortArgs(1, 3, 5, 2, 4, 6));
