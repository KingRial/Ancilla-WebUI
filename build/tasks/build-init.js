var gulp = require('gulp');
var gulpDebug = require('gulp-debug');
var gulpPrompt = require('gulp-prompt');
var gulpMap = require('map-stream');
var gulpIf = require('gulp-if');

var _oPackager = require('../packager');
var child_process = require('child_process');

gulp.task('build-init', function( fCallback ) {
	return gulp.src( 'gulpfile.js' )
		// Choosing Package Type and Brand
		.pipe(
			gulpPrompt.prompt([/*{
				type: 'list',
				name: 'sCurrentPackageType',
				message: 'Choose the update package type:',
				choices: _oPackager.getPackageTypeList(),
				default: 0
			},*/{
				type: 'list',
				name: 'sCurrentBrand',
				message: 'Choose the Brand',
				choices: _oPackager.getBrandsList(),
				default: 0
			}],
			function( oAnswers ){
				_oPackager.setCurrentOptions( oAnswers );
			})
		)
		// Choosing Product
		.pipe(
			gulpPrompt.prompt([{
				type: 'list',
				name: 'sCurrentProduct',
				message: 'Choose the Product:',
				choices: function(){ return _oPackager.getCurrentBrand().getProductsList();},
				default: 0
			}],
			function( oAnswers ){
				_oPackager.setCurrentOptions( oAnswers );
			})
		)
		// Chossing default/custom options
		.pipe(
			gulpPrompt.prompt([{
				type: 'confirm',
				name: 'bUseDefaultOptions',
				message: 'Use Default Options ?',
				default: true
			}],
			function( oAnswers ){
				_oPackager.setCurrentOptions( oAnswers );
				if( oAnswers.bUseDefaultOptions ){
					/*
					var _aCurrentLowLvlSrvs = [];
					var _aTmp = _oPackager.getCurrentProduct().getLowLvlSrvs();
					for( var _iIndex in _aTmp ){
						_aCurrentLowLvlSrvs.push( _aTmp[ _iIndex ].name );
					}
					*/
					var _oDefaultAnswers = {
						aCurrentModules: _oPackager.getList( 'modules' ),
						aCurrentProducts: _oPackager.getList( 'products' ),
						aCurrentThemes: _oPackager.getList( 'themes' ),
						aCurrentApps: _oPackager.getList( 'apps' ),
						aCurrentLowLvlImgs: _oPackager.getList( 'lowLvlImgs' ),
						aCurrentLowLvlSrvs: _oPackager.getList( 'lowLvlSrvs' )
					};
					_oPackager.setCurrentOptions( _oDefaultAnswers );
					/*
					console.info('DEFAULT OPTIONS:');
					console.info(' Modules:\t%j', _oDefaultAnswers.aCurrentModules );
					console.info(' Products:\t%j', _oDefaultAnswers.aCurrentProducts );
					console.info(' Themes:\t%j', _oDefaultAnswers.aCurrentThemes );
					console.info(' Apps:\t%j', _oDefaultAnswers.aCurrentApps );
					console.info(' LowLvlImgs:\t%j', _oDefaultAnswers.aCurrentLowLvlImgs );
					console.info(' LowLvlSrvs:\t%j', _oDefaultAnswers.aCurrentLowLvlSrvs );
					*/
				}
			})
		)
		// Choosing Delete downloaded data
		.pipe(
			gulpIf(
				function(){ return ( !_oPackager.getCurrentOption('bUseDefaultOptions') ); },
				gulpPrompt.prompt([{
					type: 'confirm',
					name: 'bUseSVN',
					message: 'Get source from SVN ?',
					default: function(){ return _oPackager.getCurrentProduct().getUseSVN(); }
				}],
				function( oAnswers ){
					_oPackager.setCurrentOptions( oAnswers );
				}),
				gulpMap( function( oFile, fCallback){
					// Setting default product option
					_oPackager.setCurrentOptions( { bUseSVN: _oPackager.getCurrentProduct().getUseSVN() } );
					fCallback( null, fCallback )
				} )
			)
		)
		/*
		// Choosing Delete downloaded data
		.pipe(
			gulpPrompt.prompt([{
				type: 'confirm',
				name: 'bClearCurrent',
				message: 'Clear previously downloaded data ?',
				default: false
			}],
			function( oAnswers ){
				_oPackager.setCurrentOptions( oAnswers );
			})
		)
		*/
		// Choosing SVN items
		.pipe(
			gulpIf(
				function(){ return ( !_oPackager.getCurrentOption('bUseDefaultOptions') && _oPackager.getUseSVN() ); },
				gulpPrompt.prompt([{
					type: 'checkbox',
					name: 'aCurrentModules',
					message: 'Choose the Modules:',
					choices: function(){ return _oPackager.getList( 'modules', { bUseAll: true } );}
				},{
					type: 'checkbox',
					name: 'aCurrentProducts',
					message: 'Choose the Products:',
					choices: function(){ return _oPackager.getList( 'products', { bUseAll: true } );}
				},{
					type: 'checkbox',
					name: 'aCurrentThemes',
					message: 'Choose the Themes:',
					choices: function(){ return _oPackager.getList( 'themes', { bUseAll: true } );}
				},{
					type: 'checkbox',
					name: 'aCurrentApps',
					message: 'Choose the Apps:',
					choices: function(){ return _oPackager.getList( 'apps', { bUseAll: true } );}
				},{
					type: 'list',
					name: 'aCurrentLowLvlImgs',
					message: 'Choose the Firmware:',
					choices: function(){ return _oPackager.getList( 'lowLvlImgs', { bUseAll: true } );}
				},{
					type: 'checkbox',
					name: 'aCurrentLowLvlSrvs',
					message: 'Choose the Low lvl services:',
					choices: function(){ return _oPackager.getList( 'lowLvlSrvs', { bUseAll: true } );}
				}],
				function( oAnswers ){
					_oPackager.setCurrentOptions( oAnswers );
				})
			)
		)
		// Choosing SVN Branch
		.pipe(
			gulpIf(
				function(){ return ( !_oPackager.getCurrentOption('bUseDefaultOptions') && _oPackager.getUseSVN() ); },
				gulpPrompt.prompt([{
					type: 'input',
					name: 'sCurrentBranch',
					message: 'SVN Branch:',
					default: function(){ return _oPackager.getCurrentProduct().getBranch() }
				}],
				function( oAnswers ){
					_oPackager.setCurrentOptions( oAnswers );
				}),
				gulpMap( function( oFile, fCallback){
					// Setting default product option
					_oPackager.setCurrentOptions( { sCurrentBranch: _oPackager.getCurrentProduct().getBranch() } );
					fCallback( null, fCallback )
				} )
			)
		)
		// Data is correct ?
		//.pipe( gulpPrompt.confirm( '[ READY ] Are the datas correct ?' ) )
		// Chossing SVN Username / Password
		.pipe(
			gulpIf(
				function(){ return _oPackager.getUseSVN(); },
				gulpPrompt.prompt([{
					type: 'input',
					name: 'sSVNUsername',
					message: 'SVN Username:',
					default: _oPackager.getSVNUsername()
				},{
					type: 'password',
					name: 'sSVNPassword',
					message: 'SVN Password:',
					default: _oPackager.getSVNPassword()
				}],
				function( oAnswers ){
					_oPackager.setCurrentOptions( oAnswers );
				})
			)
		)
		// Selecting default SVN revision
		.pipe(
			gulpIf(
				function(){ return _oPackager.getUseSVN(); },
				gulpMap( function( oFile, fCallback){
					child_process.execFile(
						'svn',
						[
							'info',
							'--username', _oPackager.getSVNUsername() ,
							'--password', _oPackager.getSVNPassword(),
							'--no-auth-cache',
							'--non-interactive',
							_oPackager.getSVNRoot() + _oPackager.getCurrentBranch()
						],
						function( oError, sOut, sError ) {
							//process.stderr.write( oError );
							//process.stdout.write( sOut );
							var _aOutput = sOut.split('\n');
							var _sRevision = _aOutput[ 5 ];
							var _aMatches = _sRevision.match( /^.*:(.*)/ );
							var _iRevision = parseInt( _aMatches[ 1 ] );
							_oPackager.setCurrentOptions( { iRevision: _iRevision } );
							fCallback( oError, oFile );
						}
					);
				})
			)
		)
		// Choosing SVN revision
		.pipe(
			gulpIf(
				function(){ return _oPackager.getUseSVN(); },
				gulpPrompt.prompt([{
					type: 'input',
					name: 'iRevision',
					message: 'Choose the Revision:',
					default: function(){ return 'latest [' + _oPackager.getCurrentRevision() + ']' }
				}],
				function( oAnswers ){
					if( oAnswers.iRevision.indexOf( 'latest' )!= -1 ){
						oAnswers.iRevision = _oPackager.getCurrentRevision();
						oAnswers.bLatestRevision = true;
					} else {
						oAnswers.bLatestRevision = false;
					}
					_oPackager.setCurrentOptions( oAnswers );
				})
			)
		)
	;
});
