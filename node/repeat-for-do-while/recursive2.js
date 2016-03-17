recursive(1, 10);
function recursive(i, n) {
	console.log(i);
	if (i < n) recursive(i + 1, n);
	return;
}
