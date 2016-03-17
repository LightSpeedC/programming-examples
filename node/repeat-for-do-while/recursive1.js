recursive(10);
function recursive(n) {
	if (n > 1) recursive(n - 1);
	console.log(n);
	return;
}
