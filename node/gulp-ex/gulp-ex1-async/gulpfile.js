'use strict';

const gulp = require('gulp');
const aa = require('aa');
const x = '[--:--:--]';
const EventEmitter = require('events').EventEmitter;

const sleep = (ms, val, cb) => setTimeout(cb, ms, null, val);
const delay = (ms, val) => cb => setTimeout(cb, ms, null, val);
const wait = (ms, val) => new Promise(res => setTimeout(res, ms, val));

gulp.task('default', ['task1', 'task2', 'task3', 'task4', 'task5', 'task6'], function (cb) {
	console.log(x, 'Starting  default')
	console.log(x, 'Finished  default')
	cb();
});

gulp.task('task1', [], cb => sleep(600, 'task1', cb));
gulp.task('task2', [], () => wait(500, 'task2'));
gulp.task('task3', [], delay(400, 'task3'));
gulp.task('task4', [], cb => delay(300, 'task4')(cb));
gulp.task('task5', [], () => aa(function *() {
	console.log(x, 'Starting  task5')
	yield delay(100);
	yield wait(100);
	console.log(x, 'Finished  task5');
}));
gulp.task('task6', [], cb => {
	console.log(x, 'Starting  task6');
	setTimeout(() => (console.log(x, 'Finished  task6'), cb()), 100);
});
//gulp.task('task5', [], function *() {
//	yield delay(100);
//	yield wait(100);
//});
