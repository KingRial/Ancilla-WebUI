var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpChanged = require('gulp-changed');
var gulpDebug = require('gulp-debug');
var gulpPlumber = require('gulp-plumber');
var gulpMinifyHTML = require('gulp-minify-html');

var _oPackager = require('../packager');

gulp.task('build-HTML', function( fCallback ) {
	return gulpRunSequence(
		'build-HTML-mirror',
		fCallback
	);
});

gulp.task('build-HTML-mirror', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterHTML(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: '.html'}) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-HTML-minified', function () {
	return gulp.src( _oPackager.getCurrentDevelopmentFilterHTML(), {base: _oPackager.getCurrentDevelopmentWebRoot()} )
		.pipe( gulpPlumber() )
		.pipe( gulpChanged( _oPackager.getCurrentReleaseWebRoot() ) )
		.pipe( gulpDebug({  title: '[ HTML minify ]' } ) )
		.pipe( gulpMinifyHTML({
			empty: false, // - do not remove empty attributes
			cdata: false, // - do not strip CDATA from scripts
			comments: false, // - do not remove comments
			conditionals: false, // - do not remove conditional internet explorer comments
			spare: false, // - do not remove redundant attributes
			quotes: false, // - do not remove arbitrary quotes
			loose: false // - preserve one whitespace
		}) )
		.pipe( gulpPlumber.stop() )
		.pipe( gulp.dest( _oPackager.getCurrentReleaseWebRoot() ) )
	;
});
