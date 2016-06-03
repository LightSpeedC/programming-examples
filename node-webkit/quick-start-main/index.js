try {
	if (!global.count) global.count = 0;
	//if (global === window) alert('global === window');

	const cfg = require('./package.json');
	global.hey = function () {
		nw.Window.open('index.html', cfg.window, function (win) {
			setTimeout(() => win.close(), 7e3);
		});
		return false;
	}

	hey();

} catch (e) {
	alert(e.stack);
}
