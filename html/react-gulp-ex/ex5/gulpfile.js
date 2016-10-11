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
		'async-await-task'], () =>
	console.log(x, 'default runs after callback, thunk, promise, stream'));

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

task('async-await-task', () => aa(function *() {
	console.log(x, 'Starting  async-await');
	yield wait(10, 'async-await promise');
	yield delay(10, 'async-await thunk');
	yield cb => sleep(10, 'async-await callback', cb);
	yield function *() {
		yield wait(10, 'async-await gtor fn promise');
		yield delay(10, 'async-await gtor fn thunk');
		yield cb => sleep(10, 'async-await gtor fn callback', cb);
	};
	yield function *() {
		yield wait(10, 'async-await gtor promise');
		yield delay(10, 'async-await gtor thunk');
		yield cb => sleep(10, 'async-await gtor callback', cb);
	} ();
	yield *function *() {
		yield wait(10, 'async-await *gtor promise');
		yield delay(10, 'async-await *gtor thunk');
		yield cb => sleep(10, 'async-await *gtor callback', cb);
	} ();
	console.log(x, 'Finished  async-await');
}));

function sleep(ms, val, cb) {
	console.log(x, 'Starting ', val);
	setTimeout(() => {
		console.log(x, 'Finished ', val);
		cb(null, val);
	}, ms);
}

function delay(ms, val) {
	return cb => {
		console.log(x, 'Starting ', val);
		setTimeout(() => {
			console.log(x, 'Finished ', val);
			cb(null, val);
		}, ms);
	};
}

function wait(ms, val) {
	return new Promise(res => {
		console.log(x, 'Starting ', val);
		setTimeout(() => {
			console.log(x, 'Finished ', val);
			res(val);
		}, ms);
	});
}
