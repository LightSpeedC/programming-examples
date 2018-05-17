const gulp = require('gulp');
const browserify = require('browserify');
const babelify = require('babelify');
const source = require('vinyl-source-stream');

gulp.task('default', function () {
	return browserify('./src/app.js')
		.transform(babelify, {presets: ['react']})
		.bundle()
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./'));
});

// http://qiita.com/zuzu/items/c77dbf0a72600ce2465e
