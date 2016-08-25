'use strict';
var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('build', function() {
	return gulp.src('src/*.js')
		.pipe(babel({
			presets: ['es2015', 'stage-0']
		}))
		.pipe(gulp.dest('lib'));
});

gulp.task('build-mock', ['build'], function() {
	return gulp.src('./calls.js', {read: false})
		.pipe(require('./lib/index')())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build-mock'], function(){
	process.exit(0);
});

