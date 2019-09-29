function sortArgs() {
	Object.setPrototypeOf(arguments, Array.prototype);
	return arguments.sort().join(',');
}

console.log(sortArgs(1, 3, 5, 2, 4, 6));
