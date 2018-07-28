void function () {
	'use strict';

	const Thunk = require('./thunk');
	const cmds = ['cmd /c dir /b thunk*',
		'cmd /c dir /b thunk* & ping localhost -n 2 > nul',
		'cmd /c dir /b thunk* & ping localhost -n 3 > nul',
		'cmd /c dir /b thunk* & ping localhost -n 4 > nul'];

	const child_process = require('child_process');
	function exec(cmd) {
		var thunk = Thunk(this, arguments);
		child_process.exec(cmd, thunk.callback);
		return thunk;
	}

	exec(cmds[3], execCb3);
	exec(cmds[3])(execCb3);
	exec(cmds[2], execCb2);
	exec(cmds[2])(execCb2);
	exec(cmds[1], execCb1);
	exec(cmds[1])(execCb1);
	exec(cmds[0], execCb0);
	exec(cmds[0])(execCb0);

	function execCb3(error, stdout, stderr) {
		console.log(3, {e: error, stdout: stdout, stderr: stderr});
	}
	function execCb2(error, result) {
		console.log(2, {e: error, result: result});
	}
	function execCb1(result) {
		console.log(1, {result: result});
	}
	function execCb0() {
		console.log(0, arguments);
	}

}();
