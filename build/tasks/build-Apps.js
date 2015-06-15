var gulp = require('gulp');
var gulpBabel = require('gulp-babel');
var gulpSourcemaps = require('gulp-sourcemaps');
var gulpPlumber = require('gulp-plumber');
var gulpChanged = require('gulp-changed');
var gulpDebug = require('gulp-debug');
var gulpRename = require('gulp-rename');
var gulpIf = require('gulp-if');
var gulpRunSequence = require('run-sequence');

var assign = Object.assign || require('object.assign');
var compilerOptions = require('../babel-options');
var _oPackager = require('../packager');

gulp.task( 'build-Apps', function( fCallback ) {
	//Inside this task otherwise it's not possible to configure the "Current Product"
	var __aBuildAppsTasks = [ 'nop' ];
	var __aAppTaskTypes = [ 'HTML', 'CSS', 'js' ];
	var __oCurrentProduct = _oPackager.getCurrentProduct();
	var __aCurrentProductApps = __oCurrentProduct.getApps();
	var __sJsBuildType = __oCurrentProduct.getJsBuildType();
	for( var _iIndex in __aCurrentProductApps ){
		var __aHierarchyThemes = __aCurrentProductApps[ _iIndex ];
		__aBuildAppsTasks.push( 'build-app-' + __aCurrentProductApps[ _iIndex ] );
		for( var _iIndex in __aHierarchyThemes ){
			var __sApp = __aHierarchyThemes[ _iIndex ];
			var __bIsHiearchy = ( _iIndex == ( __aHierarchyThemes.length - 1 ) );
			//Building Tasks for each App
			for( var _iIndex in __aAppTaskTypes ){
				//Sub App Tasks
				( function( sApp, sTaskType ){ //Capturing __sApp value to be used inside the tasks
					gulp.task( 'build-app-' + sApp + '-' + sTaskType, function() {
						var _sExtension = null;
						switch( sTaskType ){
							case 'js':
								_sExtension = '.js';
							break;
							case 'CSS':
								_sExtension = '.css';
							break;
							case 'HTML':
							default:
								_sExtension = '.html';
							break;
						}
						var _sFilter = '*' + _sExtension;
						return gulp.src( [
								_oPackager.getCurrentSourceWebRoot() + 'Apps/' + sApp +  '/**/' + _sFilter
							], {base: _oPackager.getCurrentSourceWebRoot() } )
							  .pipe( gulpChanged( _oPackager.getCurrentDevelopmentWebRoot(), {extension: _sExtension} ) )
								.pipe( gulpIf( ( sTaskType=='js' ), gulpDebug({ title: '[ App "' + sApp + '" building "' + __sJsBuildType + '" script ]:' } ) ) )
								.pipe( gulpPlumber() )
								.pipe( gulpSourcemaps.init() )
								.pipe( gulpIf( ( sTaskType=='js' && __sJsBuildType=='amd' ), gulpBabel(assign( {}, compilerOptions, {modules:'amd'} ) ) ) )
								.pipe( gulpIf( ( sTaskType=='js' && __sJsBuildType=='commonjs' ), gulpBabel(assign( {}, compilerOptions, {modules:'common'} ) ) ) )
								.pipe( gulpIf( ( sTaskType=='js' &&  __sJsBuildType=='system' ), gulpBabel(assign( {}, compilerOptions, {modules:'system'} ) ) ) )
								.pipe( gulpIf( ( sTaskType=='js' ), gulpSourcemaps.write( { includeContent: false, sourceRoot: '/' + _oPackager.getCurrentSourceWebRoot() } ) ) )
							.pipe( gulp.dest( _oPackager.getCurrentDevelopmentWebRoot() ) )
						;
					});
				} )( __sApp, __aAppTaskTypes[ _iIndex ] );
			}
			//Single App Task
			( function( sApp, aTaskTypess ){
				var __aTasks = [];
				for( var _iIndex in aTaskTypess ){
					__aTasks.push( 'build-app-' + sApp + '-' + aTaskTypess[ _iIndex ] );
				}
				gulp.task( 'build-app-' + sApp, function( fCallback ) {
					return gulpRunSequence(
						__aTasks,
						fCallback
					);
				});
			} )( __sApp, __aAppTaskTypes );
		}

	}
	return gulpRunSequence(
		__aBuildAppsTasks,
		fCallback
	);
});
