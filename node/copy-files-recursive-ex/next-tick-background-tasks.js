'use strict';

module.exports = nextTick;

var backgroundTasks = [], backgroundTasksInProgress = false;

var nextTickDo =
	typeof Promise === 'function' && typeof Promise.resolve === 'function' ?
	Promise.resolve :
	typeof process === 'object' && typeof process.nextTick === 'function' ?
	process.nextTick :
	typeof setImmediate === 'function' ? setImmediate :
	function setTimeout_(fn) { setTimeout(fn, 0) };

console.log(
	typeof Promise === 'function' && typeof Promise.resolve === 'function' ?
	Promise.resolve :
	typeof process === 'object' && typeof process.nextTick === 'function' ?
	process.nextTick :
	typeof setImmediate === 'function' ? setImmediate :
	function setTimeout_(fn) { setTimeout(fn, 0) });

function nextTick(fn) {
	backgroundTasks.push(fn);
	if (backgroundTasksInProgress) return;
	process.nextTick(executeBackgroundTasks);
	backgroundTasksInProgress = true;
}

function executeBackgroundTasks() {
	while (backgroundTasks.length) backgroundTasks.shift()();
	backgroundTasksInProgress = false;
}
