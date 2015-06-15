// https://www.npmjs.com/package/gulp-php2html
// https://www.npmjs.com/package/gulp-connect-php
// https://www.npmjs.com/package/gulp-filelist

var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpChanged = require('gulp-changed');

var _oPackager = require('../packager');

gulp.task('build-PHP', function( fCallback ) {
  return gulpRunSequence(
    'build-PHP-mirror',
    fCallback
  );
});

gulp.task('build-PHP-mirror', function() {
  return gulp.src( _oPackager.getCurrentSourceFilterPHP(), { base: _oPackager.getCurrentSourceWebRoot() } )
    .pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: '.php'}) )
    .pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
  ;
});

//TODO: compressing PHP files
