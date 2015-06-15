//TODO: compile with compass ? ( https://github.com/appleboy/gulp-compass )

var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpDebug = require('gulp-debug');
var gulpChanged = require('gulp-changed');
var gulpSass = require('gulp-sass');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpPlumber = require('gulp-plumber');
var _oPackager = require('../packager');

gulp.task('build-CSS', function( fCallback ) {
	return gulpRunSequence(
		'build-CSS-mirror',
		'build-CSS-compile-SCSS',
		fCallback
	);
});

gulp.task('build-CSS-mirror', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterCSS(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot() ) )
		.pipe( gulpDebug({  title: '[ CSS ]' } ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-CSS-compile-SCSS', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterSCSS(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpPlumber() )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: '.css'} ) )
		.pipe( gulpDebug({  title: '[ Sass ]' } ) )
    .pipe( gulpSass().on('error', function(oError){ console.error( oError.toString() ); this.emit('end'); }) ) // Sass OPTIONS: https://github.com/sass/node-sass
		//.pipe( gulpSourcemaps.write('./maps') )
		//.pipe( gulpSourcemaps.write() )
		.pipe( gulpPlumber.stop() )
		.pipe( gulpSourcemaps.write( { includeContent: false, sourceRoot: '/' + _oPackager.getCurrentSourceWebRoot() } ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-CSS-compressed', function() {
	return gulp.src( _oPackager.getCurrentDevelopmentFilterSCSS().concat( _oPackager.getCurrentDevelopmentFilterCSS() ), { base: _oPackager.getCurrentDevelopmentWebRoot() } )
		.pipe( gulpPlumber() )
		.pipe( gulpChanged( _oPackager.getCurrentReleaseWebRoot() ) )
		.pipe( gulpDebug({  title: '[ Compressing ]' } ) )
    .pipe( gulpSass({ // Sass OPTIONS: https://github.com/sass/node-sass
			outputStyle: 'compressed'
		}).on('error', function(oError){ console.error( oError.toString() ); this.emit('end'); }) )
		.pipe( gulpPlumber.stop() )
		.pipe( gulp.dest( _oPackager.getCurrentReleaseWebRoot() ) )
	;
});

//TODO: compressing CSS
