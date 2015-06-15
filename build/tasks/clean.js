var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');

var del = require('del');
var vinylPaths = require('vinyl-paths');

var _oPackager = require('../packager');

gulp.task('clean-rebuild', function( fCallback ) {
	return gulpRunSequence(
		//'clean-source',
		'clean-development',
		'clean-release',
		fCallback
	);
});


gulp.task('clean', function( fCallback ) {
	return gulpRunSequence(
		//'clean-source',
		'clean-jspm',
		'clean-development',
		'clean-release',
		fCallback
	);
});

gulp.task('clean-all', function( fCallback ) {
	return gulpRunSequence(
		'clean-source',
		'clean-development',
		'clean-release',
		fCallback
	);
});

gulp.task( 'clean-source', function() {
	return gulp.src( [ _oPackager.getSourceRoot() ] )
		.pipe( vinylPaths(del) )
	;
});

gulp.task( 'clean-jspm', function() {
	return gulp.src( [ _oPackager.getSourceRoot() + '/libs/External' ] )
		.pipe( vinylPaths(del) )
	;
});

gulp.task( 'clean-development', function() {
	return gulp.src( [ _oPackager.getDevelopmentRoot() ] )
		.pipe( vinylPaths(del) )
	;
});

gulp.task( 'clean-release', function() {
	return gulp.src( [ _oPackager.getReleaseRoot() ] )
		.pipe( vinylPaths(del) )
	;
});
