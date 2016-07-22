'use strict';
var gulp = require('gulp');
var mock = require('./');

gulp.task('build', function() {
	return gulp.src('./calls.js', {read: false})
		.pipe(mock())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build'], function(){
	process.exit(0);
});

