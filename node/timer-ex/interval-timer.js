var n = 30;
var oldTime = Date.now();

var timer = setInterval(function () {
	var time = Date.now();
	console.log('%d\t%d\t', time, time - oldTime, new Date);
	oldTime = time;
	if (--n <= 0)
		clearInterval(timer);
}, 1000);
