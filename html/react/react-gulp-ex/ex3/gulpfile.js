const gulp = require('gulp');
const browserify = require('browserify');
//const babelify = require('babelify');
const reactify = require('reactify');
const source = require('vinyl-source-stream');
const webserver = require('gulp-webserver');

gulp.task('browserify', function() {
	return browserify('./src/app.jsx', {debug: true})
		.transform(reactify)
		.bundle()
		.on('error', function (err) { console.log('Error :', err.message); })
		.pipe(source('bundle.js'))
		.pipe(gulp.dest('./'))
});

gulp.task('watch', function() {
	gulp.watch('./src/*.jsx', ['browserify'])
});

gulp.task('webserver', function() {
	gulp.src('./')
		.pipe(webserver({host: '127.0.0.1', port:3000, livereload: true}));
});

gulp.task('default', ['browserify', 'watch', 'webserver']);

// http://qiita.com/hkusu/items/e068bba0ae036b447754
