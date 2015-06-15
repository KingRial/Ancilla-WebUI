var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');

var _oPackager = require('../packager');

gulp.task('build-development', function( fCallback ) {
	return gulpRunSequence(
		'clean-rebuild', // Cleaning to rebuild
		'build-source',
		'build-source-to-development',
		fCallback
	);
});

gulp.task('build-source-to-development', function( fCallback ) {
	return gulpRunSequence(
		'build-jspm',
		'build-HTML',
		'build-CSS',
		'build-js',
		'build-font',
		'build-images',
		( ( _oPackager.getCurrentProduct().getApps().length > 0 ) ? 'build-Apps' : 'nop' ),
		fCallback
	);
});
