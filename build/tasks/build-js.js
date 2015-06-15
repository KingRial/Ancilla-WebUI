var gulp = require('gulp');
var gulpChanged = require('gulp-changed');
var gulpPlumber = require('gulp-plumber');
var gulpBabel = require('gulp-babel');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpRunSequence = require('run-sequence');
var gulpIf = require('gulp-if');
var gulpDebug = require('gulp-debug');
var gulpJshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var gulpUglify = require('gulp-uglify');

var assign = Object.assign || require('object.assign');
var _oPackager = require('../packager');
var compilerOptions = require('../babel-options');

gulp.task('build-js', function( fCallback ) {
	return gulpRunSequence(
		'build-js-scripts',
		'build-js-external-mirror',
		'build-js-map-mirror',
		fCallback
	);
});

gulp.task('build-js-external-mirror', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterJSExternal(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: '.js'} ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-js-scripts', function() {
	var _sJsBuildType = _oPackager.getCurrentProduct().getJsBuildType();
	return gulp.src( _oPackager.getCurrentSourceFilterJS(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpPlumber() )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: '.js'} ) )
		.pipe( gulpIf( ( _sJsBuildType=='amd' || _sJsBuildType=='commonjs' || _sJsBuildType=='system' ), gulpDebug({ title: '[ building "' + _sJsBuildType + '" script ]:' } ) ) )
		.pipe( gulpSourcemaps.init() )
		.pipe( gulpIf( ( _sJsBuildType=='amd' ), gulpBabel(assign( {}, compilerOptions, {modules:'amd'} ) ) ) )
		.pipe( gulpIf( ( _sJsBuildType=='commonjs' ), gulpBabel(assign( {}, compilerOptions, {modules:'common'} ) ) ) )
		.pipe( gulpIf( ( _sJsBuildType=='system' ), gulpBabel(assign( {}, compilerOptions, {modules:'system'} ) ) ) )
		.pipe( gulpSourcemaps.write( { includeContent: false, sourceRoot: '/' + _oPackager.getCurrentSourceWebRoot() } ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-js-map-mirror', function() {
	return gulp.src( _oPackager.getCurrentSourceFilterJSMap(), { base: _oPackager.getCurrentSourceWebRoot() } )
		.pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: '.map'} ) )
		.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
	;
});

gulp.task('build-js-lint', function() {
	//return gulp.src( _oPackager.getCurrentDevelopmentFilterJS().concat( [ '!' + _oPackager.getCurrentDevelopmentWebRoot( 'libs/Aurelia/**' ) ] ) )
	gulp.src( _oPackager.getCurrentDevelopmentFilterJS() )
		.pipe( gulpDebug({  title: '[ Lint ]' } ) )
		.pipe( gulpJshint() )
		.pipe( gulpJshint.reporter( stylish ) );
});

gulp.task('build-js-uglify', function () {
	return gulp.src( _oPackager.getCurrentDevelopmentFilterJS(), {base: _oPackager.getCurrentDevelopmentWebRoot()} )
		.pipe( gulpPlumber() )
		.pipe( gulpDebug({  title: '[ Uglify ]' } ) )
		.pipe( gulpUglify() )
		.pipe( gulpPlumber.stop() )
		.pipe( gulp.dest( _oPackager.getCurrentReleaseWebRoot() ) )
	;
});
