function recursiveFunction(i) {
	try {
		var y = recursiveFunction(i + 1);
	} catch (err) { err.count = i; return err; }
	return y;
}

console.info(typeof navigator !== 'undefined' && navigator.userAgent || 'Node.js');
var err = recursiveFunction(0);
console.warn(err);
var keys = (Object.getOwnPropertyNames || Object.keys)(err);
for (var i in keys)
	console.warn(keys[i] + ': ' + err[keys[i]]);
