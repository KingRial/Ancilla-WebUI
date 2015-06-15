var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');

gulp.task('build-package', function( fCallback ) {
	return gulpRunSequence(
		'build-release',
		'build-package-zip',
		fCallback
	);
});

gulp.task('build-package-zip', function() {
	console.error( 'TODO' );
});