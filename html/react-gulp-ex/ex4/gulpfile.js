const gulp = require('gulp');
//const plumber = require('gulp-plumber');
const browserify = require('browserify');
const babelify = require('babelify');
const literalify = require('literalify');
const fs = require('fs');

gulp.task('browserify', function () {
	return browserify({debug: true})
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
		.on('error', function (err) { console.log('Error:', err.message); })
		.pipe(fs.createWriteStream('bundle.js'));
});

gulp.task('watch', function() {
	gulp.watch('./src/*.jsx', ['browserify'])
});

gulp.task('default', ['watch', 'browserify']);

// http://qiita.com/momunchu/items/dcd95d186ac3b74d1edf
