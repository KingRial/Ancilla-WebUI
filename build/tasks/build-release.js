var gulp = require('gulp');
var gulpDebug = require('gulp-debug');
var gulpChanged = require('gulp-changed');
var gulpRunSequence = require('run-sequence');

var _oPackager = require('../packager');

gulp.task('build-release', function( fCallback ) {
	return gulpRunSequence(
		'build-development', // Building Development
		'release-development-external-mirror', // Mirroring external libs from development
		'build-HTML-minified', // Minifying HTML
		'build-CSS-compressed',
		// TODO: Concatenate files CSS ?;
		//'build-js-lint',	// Linting JS
		//'build-jspm-bundles',	// Building bundles ?
		'build-js-uglify',	// Uglify JS
		// TODO: creating bundle JS
		// TODO: Image Optimize
		fCallback
		);
});

gulp.task('release-development-external-mirror', function() {
	return gulp.src( _oPackager.getCurrentDevelopmentFilterExternal(), { base: _oPackager.getCurrentDevelopmentWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentReleaseWebRoot() ) )
		.pipe( gulp.dest( _oPackager.getCurrentReleaseWebRoot() ) )
	;
});
