var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpShell = require('gulp-shell');
//var gulpChanged = require('gulp-changed');
//var gulpDebug = require('gulp-debug');
var gulpPlumber = require('gulp-plumber');

var fs = require('fs');
var _oPackager = require('../packager');

gulp.task('build-jspm', function( fCallback ) {
	return gulpRunSequence(
		// Installing JSPM libraries only if 'jspm_config.js' is missing
		fs.existsSync( _oPackager.getSourceRoot() + '/libs/External/jspm_config.js' ) ? 'nop' : 'jspm-install',
		//fs.existsSync( _oPackager.getSourceRoot() + '/libs/External/ancilla-app-bundle.js' ) ? 'nop' : 'jspm-bundles',
		fCallback
	);
});

/*
gulp.task('build-jspm-install', function() {
	return gulp.src( _oPackager.getSourceRoot() + '/libs/External/jspm_config.js', { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot() ) )
		.pipe( gulpDebug({ title: '[ JSPM install ]:' } ) )
		.pipe( gulpShell([
	  	'jspm install -f -y'
		], {
			cwd: _oPackager.getSourceRoot()
		}) )
	;
});
*/

gulp.task('jspm-install',
	gulpShell.task([
  	'jspm install -y' // Not forced! otherwise should add -f option
	], {
		cwd: _oPackager.getSourceRoot()
	})
);

gulp.task('jspm-bundles', function () {
	// TODO: materialize is missing; try to understand the problem!
	gulpShell.task([
		"jspm bundle '*' + bluebird + jquery + forge + aurelia-skeleton-navigation/* + aurelia-bootstrapper + aurelia-http-client + aurelia-dependency-injection + aurelia-router ancilla-app-bundle.js --inject --minify"
	], {
		cwd: _oPackager.getSourceRoot() + '/libs/External/'
	})
});
