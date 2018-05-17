const gulp = require('gulp');
const uglify = require('gulp-uglify');
const plumber = require('gulp-plumber');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const reactify = require('reactify');
const buffer = require('vinyl-buffer');


gulp.task('dist', function(){
	return browserify('./src/app.jsx', {debug: true})
		.transform(reactify)
		.bundle()
		.pipe(plumber())
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(uglify())
		.pipe(gulp.dest('./'));
});


gulp.task('watch', function() {
	gulp.watch('./src/*.js', ['dist']);
	gulp.watch('./src/*.jsx', ['dist']);
});


gulp.task('default', ['dist', 'watch']);

// http://jbelltree.hatenablog.com/entry/2016/02/28/161941
