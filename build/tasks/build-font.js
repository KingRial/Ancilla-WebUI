//TODO: compile with compass ? ( https://github.com/appleboy/gulp-compass )

var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpDebug = require('gulp-debug');
var gulpChanged = require('gulp-changed');
var gulpSass = require('gulp-sass');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpPlumber = require('gulp-plumber');
var _oPackager = require('../packager');

gulp.task('build-font', function( fCallback ) {
	return gulpRunSequence(
		'build-font-mirror',
		fCallback
	);
});

gulp.task('build-font-mirror', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterFont(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot() ) )
		.pipe( gulpDebug({  title: '[ Font ]' } ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});
