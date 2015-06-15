var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');

var _oPackager = require('../packager');

gulp.task('build-source', function( fCallback ) {
	return gulpRunSequence(
		'build-init', // Prompting requests
		'build-source-from-SVN',
		fCallback
	);
});

//Using differen task or getUseSVN method is undefined
gulp.task('build-source-from-SVN', function( fCallback ) {
	return gulpRunSequence(
		( _oPackager.getUseSVN() ? 'build-SVN-source' : 'nop' ), // Downloading SVN ( if needed )
		fCallback
	);
});
