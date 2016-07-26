var n = 30;
var oldTime = Date.now();

f();
function f() {
	var time = Date.now();
	console.log('%d\t%d\t', time, time - oldTime, new Date);
	oldTime = time;
	if (--n > 0)
		setTimeout(f, 1000 - Date.now() % 1000);
}
