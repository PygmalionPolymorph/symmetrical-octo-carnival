var gulp = require('gulp');
var less = require('gulp-less');
var watch = require('gulp-watch');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('less', function () {
  return gulp.src('*.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    gulp.watch('*.less', ['less']);  // Watch all the .less files, then run the less task
});

gulp.task('default',['watch']);
