'use strict';

const gulp = require('gulp');
//const plumber = require('gulp-plumber');
const browserify = require('browserify');
const babelify = require('babelify');
const literalify = require('literalify');
const fs = require('fs');

gulp.task('browserify', () =>
	browserify({debug: true})
		.transform(babelify.configure({
			presets: ['es2015', 'react']
		}))
		.transform(literalify.configure({
			'react': 'window.React',
			'react-dom': 'window.ReactDOM',
			'react-router': 'window.ReactRouter'
		}))
		.require('./src/app.jsx', {entry: true})
		.bundle()
		.on('error', err => console.log('Error:', err.message))
		.pipe(fs.createWriteStream('bundle.js')));

gulp.task('watch', () =>
	gulp.watch('./src/*.jsx', ['browserify']));

gulp.task('copy-min-js', () =>
	gulp.src(['./node_modules/react/dist/*.min.js',
			'./node_modules/react-dom/dist/*.min.js',
			'./node_modules/react-router/umd/*.min.js'])
		.pipe(gulp.dest('./js')));

gulp.task('default', ['copy-min-js', 'watch', 'browserify']);

// http://qiita.com/momunchu/items/dcd95d186ac3b74d1edf
