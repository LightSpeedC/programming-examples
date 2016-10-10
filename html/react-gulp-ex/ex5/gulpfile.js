const gulp = require('gulp'), task = gulp.task.bind(gulp);
const EventEmitter = require('events').EventEmitter;
const aa = require('aa');
const ins = require('util').inspect;
//console.log('module', ins(module, {colors: true, depth:0}));
//console.log('require', ins(require, {colors: true, depth:0}));

console.log(gulp);

function sleep(ms, val, cb) {
	setTimeout(cb, ms, null, val);
}

function delay(ms, val) {
	return function (cb) { setTimeout(cb, ms, null, val); };
}

function wait(ms, val) {
	return new Promise(function (res, rej) {
		setTimeout(res, ms, val);
	});
}


task('default', ['task1', 'task2', 'task3', 'task4'], function (cb) {
	console.log('default function');
	cb();
});

task('task1', [], cb => sleep(300, 'task1', cb));
task('task2', [], delay(100, 'task2'));
task('task3', [], () => wait(200, 'task3'));
task('task4', [], () => {
	//const ev = new EventEmitter();
	//ev.on('end', () => console.log('ev end'));
	//ev.on('error', err => console.log('ev err', err));
	//return ev;
	return task('task5', ['task2']);
});
