import gulp from 'gulp'; // eslint-disable-line import/no-extraneous-dependencies
import babel from 'gulp-babel'; // eslint-disable-line import/no-extraneous-dependencies

gulp.task('build', () => gulp.src('src/*.js')
  .pipe(babel({
    presets: ['es2015', 'stage-0'],
  }))
  .pipe(gulp.dest('lib')));

gulp.task('build-mock', ['build'], () => gulp.src('./calls.js', {
    read: false,
  })
  .pipe(require('./lib')) // eslint-disable-line global-require
  .pipe(gulp.dest('dist')));

gulp.task('default', ['build-mock'], () => process.exit(0));
