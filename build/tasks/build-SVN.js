var gulp = require('gulp');
var gulpRunSequence = require('run-sequence');
var gulpChanged = require('gulp-changed');
var gulpMap = require('map-stream');

var _oPackager = require('../packager');
var child_process = require('child_process');
var fs = require('fs');
var Promise = require('promise');

gulp.task('build-SVN-source', function( fCallback ) {
  return gulp.src( 'gulpfile.js' )
    .pipe(
        gulpMap( function( oFile, fCallback){
          // Init
          var _aPromises = [];
          var _aLowLvlSrvs = _oPackager.getList( 'lowLvlSrvs' );
          var _bIsSVNLatest = _oPackager.isLatestRevision();
          // Paths
          var _sSourcePath = _oPackager.getRemoteSVNPath();
          var _sSourceWebPath = _sSourcePath + '/web/';
          var _sDestinationWebPath = _oPackager.getCurrentLocalSVNPath( 'www/' );
          // Checking Presence of already downloaded items
          if( fs.existsSync( _oPackager.getCurrentLocalSVNPath() ) ){
            if( _oPackager.isLatestRevision() ){
              // SVN update WWW
              _aPromises.push( new Promise( function( fResolve, fReject ){
                __SVNAction( 'update', _sSourceWebPath, _sDestinationWebPath, fResolve );
                })
              )
              Promise.all( _aPromises ).then( function(){
                fCallback( null, oFile );
              } );
            } else {
              console.info( 'Already downloaded.' );
              fCallback( null, oFile );
            }
          } else {
            for( var _iIndex in _aLowLvlSrvs ){
              // SVN Export Low Lvl Services BIN
              var _oLowLvlSrv = _aLowLvlSrvs[ _iIndex ];
              var _sSourceLowLvlBinPath = _sSourcePath + '/' + _oLowLvlSrv.name + '/bin';
              var _sDestinationPath = _oPackager.getCurrentLocalSVNPath( 'lowLvlSrv/' + _oLowLvlSrv.name + '/' );
              _aPromises.push( new Promise( function( fResolve, fReject ){
                __SVNAction( 'export', _sSourceLowLvlBinPath, _sDestinationPath, fResolve );
                })
              )
              // SVN Export Low Lvl Services SHELLS
              var _sSourceLowLvlShellPath = _sSourcePath + '/_packetTools/lowLvlSrv/' + _oLowLvlSrv.name + '/';
              var _sDestinationPath = _oPackager.getCurrentLocalSVNPath( 'lowLvlSrv/' + _oLowLvlSrv.name + '/' );
              _aPromises.push( new Promise( function( fResolve, fReject ){
                __SVNAction( 'export', _sSourceLowLvlShellPath, _sDestinationPath, fResolve, true );
                })
              )
            }
            // SVN Checkout/Export WWW ( it depends from "latest" revision or not )
            _aPromises.push( new Promise( function( fResolve, fReject ){
              __SVNAction( ( _bIsSVNLatest ? 'checkout' : 'export' ), _sSourceWebPath, _sDestinationWebPath, fResolve );
              })
            )
            Promise.all( _aPromises ).then( function(){
              fCallback( null, oFile );
            } );
        }
        })
      )
    ;
});

function __SVNAction( sType, sSourcePath, sDestinationPath, fCallback, bIgnoreDirCheck ){
  var _aArguments = null;
  switch( sType ){
    case 'checkout':
      _aArguments = [
        'checkout',
        '--force',
        '--username', _oPackager.getSVNUsername() ,
        '--password', _oPackager.getSVNPassword(),
        '--no-auth-cache',
        '--non-interactive',
        sSourcePath,
        sDestinationPath
      ];
      console.log('[ SVN checkout ] "' + sSourcePath + '" to "' + sDestinationPath + '"...');
      break;
    case 'update':
      _aArguments = [
        'update',
        '--force',
        '--username', _oPackager.getSVNUsername() ,
        '--password', _oPackager.getSVNPassword(),
        '--no-auth-cache',
        '--non-interactive',
        sDestinationPath
      ];
      console.log('[ SVN update ] "' + sDestinationPath + '"...');
      break;
    case 'export':
    default:
      _aArguments = [
        'export',
        '--force',
        '--username', _oPackager.getSVNUsername() ,
        '--password', _oPackager.getSVNPassword(),
        '--no-auth-cache',
        '--non-interactive',
        '--revision', _oPackager.getCurrentRevision(),
        sSourcePath,
        sDestinationPath
      ];
      console.log('[ SVN export ] "' + sSourcePath + '" to "' + sDestinationPath + '"...');
      break;
  }
  //Export
  var _oSVNExport = child_process.spawn( 'svn', _aArguments );
  _oSVNExport.stdout.on('data', function( data ){
    //console.log( data.toString() );
    process.stdout.write(".");
  });
  _oSVNExport.stderr.on('data', function( data ){
    console.error( '\n' + data.toString() );
  });
  _oSVNExport.on('close', function ( iCode ) {
    console.log( 'Completed.' );
    if( fCallback ){
      fCallback();
    }
  });
}
