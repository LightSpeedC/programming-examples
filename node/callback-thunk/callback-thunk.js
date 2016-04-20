void function () {
	'use strict';

	const Thunk = require('./thunk');

	function someProc(msec) {
		var thunk = Thunk(this, arguments);
		setTimeout(thunk.callback, msec);
		return thunk;
	}

	someProc(100, function () { console.log('100'); });
	someProc(200)(function () { console.log('200'); });

	var exec = require('child_process').exec;
	function exec2(cmd) {
		var thunk = Thunk(this, arguments);
		exec(cmd, thunk.callback);
		return thunk;
	}

	exec2('cmd /c dir /b', exec2cb3);
	exec2('cmd /c dir /b')(exec2cb3);
	exec2('cmd /c dir /b', exec2cb2);
	exec2('cmd /c dir /b')(exec2cb2);
	exec2('cmd /c dir /b', exec2cb1);
	exec2('cmd /c dir /b')(exec2cb1);

	function exec2cb3(error, stdout, stderr) {
		console.log({error: error, stdout: stdout, stderr: stderr});
	}
	function exec2cb2(error, result) {
		console.log({error: error, result: result});
	}
	function exec2cb1(result) {
		console.log({result: result});
	}

}();
