var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpDebug = require('gulp-debug');
var gulpChanged = require('gulp-changed');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpPlumber = require('gulp-plumber');
var _oPackager = require('../packager');

gulp.task('build-images', function( fCallback ) {
	return gulpRunSequence(
		'build-images-mirror',
		fCallback
	);
});

gulp.task('build-images-mirror', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterImages(), { base: _oPackager.getCurrentSourceWebRoot() } )
    .pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot() ) )
    //.pipe( gulpDebug({  title: '[ Images ]' } ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-images-optimization', function() {
	return gulp.src( _oPackager.getCurrentDevelopmentFilterImages(), { base: _oPackager.getCurrentDevelopmentWebRoot() } )
		.pipe( gulpPlumber() )
		.pipe( gulpChanged( _oPackager.getCurrentReleaseWebRoot() ) )
//TODO: https://github.com/firetix/gulp-image-optimization
		//.pipe( gulpDebug({  title: '[ Optimizing ]' } ) )
		.pipe( gulpPlumber.stop() )
		.pipe( gulp.dest( _oPackager.getCurrentReleaseWebRoot() ) )
	;
});
