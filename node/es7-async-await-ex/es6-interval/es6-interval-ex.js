// ES6 interval timer.

	var aa = require('aa'), Channel = aa.Channel;

	aa(function *main() {
		var chan = Channel();

		var countDown = 10;
		var interval = setInterval(function () { chan(countDown--); }, 100);

		var val;
		while (val = yield chan)
			console.log('count:', val);

		clearInterval(interval);
	});
