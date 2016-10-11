'use strict';

const gulp = require('gulp'), task = gulp.task.bind(gulp);
const stream = require('stream');
const aa = require('aa');

const x = '[--:--:--]';

task('default', [
		'callback-task',
		'thunk-task',
		'promise-task',
		'stream-task',
		'sync-task',
		'aa-task'], () =>
	console.log(x, 'default runs after all tasks'));

task('callback-task', cb => sleep(600, 'callback', cb));

task('thunk-task', delay(500, 'thunk'));

task('promise-task', () => wait(400, 'promise'));

task('stream-task', () => {
	console.log(x, 'Starting  stream')
	const w = new stream.Writable;
	setTimeout(() => {
		console.log(x, 'Finished  stream');
		w.end();
	}, 300);
	return w;
});

task('sync-task', () => {
	console.log(x, 'Starting  sync');
	console.log(x, 'Finished  sync');
});

task('aa-task', () => aa(function *() {
	console.log(x, 'Starting  aa');
	yield wait(10, 'aa promise');
	yield delay(10, 'aa thunk');
	yield cb => sleep(10, 'aa callback', cb);
	yield function *() {
		yield wait(10, 'aa gtor fn promise');
		yield delay(10, 'aa gtor fn thunk');
	};
	yield function *(arg) {
		yield wait(10, arg + 'promise');
		yield delay(10, arg + 'thunk');
	} ('aa gtor ');
	yield *function *(arg) {
		yield wait(10, arg + 'promise');
		yield delay(10, arg + 'thunk');
	} ('aa *gtor ');
	console.log(x, 'Finished  aa');
}));

function sleep(ms, val, cb) {
	console.log(x, 'Starting ', val, 'sleep');
	setTimeout(() => {
		console.log(x, 'Finished ', val, 'sleep');
		cb(null, val);
	}, ms);
}

function delay(ms, val) {
	return cb => {
		console.log(x, 'Starting ', val, 'delay');
		setTimeout(() => {
			console.log(x, 'Finished ', val, 'delay');
			cb(null, val);
		}, ms);
	};
}

function wait(ms, val) {
	return new Promise(res => {
		console.log(x, 'Starting ', val, 'wait');
		setTimeout(() => {
			console.log(x, 'Finished ', val, 'wait');
			res(val);
		}, ms);
	});
}
