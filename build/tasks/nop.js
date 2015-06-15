var gulp = require('gulp');
var gulpNop = require('gulp-nop');

gulp.task( 'nop', function() {
  return gulp.src( 'gulpfile.js'  )
    .pipe( gulpNop() )
  ;
});
