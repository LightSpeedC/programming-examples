var nextTickBackgroundTasks = function () {
	'use strict';

	var tasks = [], progress = false;

	var nextTickDo =
		typeof Promise === 'function' && typeof Promise.resolve === 'function' ?
			function resolvePromise(fn) { Promise.resolve().then(fn); } :
			typeof process === 'object' && typeof process.nextTick === 'function' ?
				process.nextTick :
				typeof setImmediate === 'function' ? setImmediate :
					function setTimeout_(fn) { setTimeout(fn, 0) };

	return nextTickBackgroundTasks;

	function nextTickBackgroundTasks(fn) {
		tasks.push(fn);
		if (progress) return;
		progress = true;
		nextTickDo(executor);
	}

	function executor() {
		while (tasks.length) (tasks.shift())();
		progress = false;
	}

}(); // nextTickBackgroundTasks

if (typeof module === 'object' && module && module.exports)
	module.exports = nextTickBackgroundTasks;
