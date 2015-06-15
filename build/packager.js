var extend = require( 'extend' );

var _oPathfinder = require('./pathfinder');

var Packager = function(){
	this.__aBrands = {};
	this.__oCurrentOptions = {
		sSVNUsername: 'riccardo.re',
		sSVNPassword: 'rialre1980',
		sSVNRoot: 'svn://192.168.0.21/projects/K3_project/branches/'
	};
	//TODO: Should be filled by checking SVN
	this.__oAll = {
		aModules : [ 'bentel', 'bridge', 'camera', 'eib', 'eibdatalog', 'elmo', 'energy', 'ibeacon', 'konnect', 'lighting', 'logic', 'networx-nx', 'nfc', 'paradox-evo', 'pbx', 'pess', 'reporting', 'scenario', 'scripting', 'securforce', 'siemens-edp', 'sms', 'supervision', 'system', 'techno-bus', 'techno-sec', 'tecnoalarm', 'tutondo', 'vimar-byme', 'vivaldi', 'voice' ],
		aProducts : [ 'AKNXserver', 'ASUperio', 'BVikoServer', 'BVikoSuperio', 'CleverKon', 'Eyeon', 'iKon', 'K3', 'PessServer', 'U.motion-Server', 'U.motion-Touch', 'Vimar-Webserver', 'XWayBentel', 'XWayNetworxNx', 'XWayParadoxEvo', 'XWaySecurforce', 'XWaySiemensEDP', 'XWayTecnoalarm', 'XWayTutondo' ],
		aThemes : [ 'admin', 'core', 'ebony', 'eyeon', 'eyeon-admin', 'ivory', 'ivory-ui', 'merten', 'merten-admin', 'plain-light', 'schneider', 'schneider-admin', 'u.motion-dark', 'vimar', 'vimar-admin' ],
		aLowLvlImgs : [ 'ikon-alix', 'ikon-aria', 'ikon-arm', 'knxsuperio-i386-jetaway' ],
		aLowLvlSrv : [ { name: "dpadcgi", reboot: 1 }, { name: "dpadcmd", reboot: 0 }, { name: "dpadd", reboot: 0 }, { name: "dpadws", reboot: 1 }, { name: "eibd", reboot: 0 }, { name: "elmod", reboot: 0 }, { name: "genericserialreader", reboot: 0 }, { name: "genericserialwriter", reboot: 0 }, { name: "getserialnumber", reboot: 0 }, { name: "getserialnumberd", reboot: 0 }, { name: "getserialnumberdcmd", reboot: 0 }, { name: "resourcemonitor", reboot: 0 } ]
	};
	this.__oMapInheritance = {
		aModules: {
			'*': 'system'
		},
		aProducts: {
			'*': 'K3'
		},
		aThemes: {
			'*': 'core',
			'ebony': 'ivory',
			'eyeon': 'ivory',
			'eyeon-admin': 'admin',
			'ivory-ui': 'ivory',
			'merten': 'schneider',
			'merten-admin': 'schneider-admin',
			'plain-light': 'ivory',
			'schneider': 'ivory',
			'schneider-admin': 'admin',
			'u.motion-dark': 'schneider',
			'vimar': 'ivory',
			'vimar-admin': 'admin'
		}
	}
}

Packager.prototype = {
	addBrand: function( oBrand ){
		this.__aBrands[ oBrand.getName() ] = oBrand;
	},

	getBrand: function( sName ){
		if( sName ){
			return this.__aBrands[ sName ];
		} else {
			return this.__aBrands;
		}
	},

	getCurrentBrand: function(){
		return this.getBrand( this.__oCurrentOptions.sCurrentBrand );
	},

	getCurrentProduct: function(){
		return this.getCurrentBrand().getProduct( this.__oCurrentOptions.sCurrentProduct );
	},

	setCurrentOptions: function( oOptions ){
		this.__oCurrentOptions = extend( {}, oOptions, this.__oCurrentOptions );
	},

	getCurrentOption: function( sField ){
		return this.__oCurrentOptions[ sField ];
	},

	getPackageTypeList: function(){
		return [ 'Incremental (everything)',  'Differential (only differences)', 'Custom (Differential over theme images and Incremental for all the rest)'];
	},

	getBrandsList: function(){
		var _aBrandsList = [];
		for( var _sBrand in this.__aBrands ){
			_aBrandsList.push( _sBrand );
		}
		return _aBrandsList;
	},

	addInheritanceToList: function( aList, sType ){
		var _aList = aList.slice();
		var _sType = 'a' + sType.charAt(0).toUpperCase() + sType.slice(1);
		var _aMap = this.__oMapInheritance[ _sType ];
		for( var _iIndex in _aList ){
			var _sElement = _aList[ _iIndex ];
			_aList = this.__checkInheritanceFromMap( _aList, _aMap, _sElement );
		}
		return _aList;
	},

	__checkInheritanceFromMap: function( aList , aMap, sElement ){
		if( aMap ){
			if( !sElement ){
				sElement = aList[ 0 ];
			}
			var _sParentElement = aMap[ sElement ];
			if( _sParentElement ){ // Handling parent inheritance
				if( aList.indexOf( _sParentElement )==-1 ){
					aList.unshift( _sParentElement );
					return this.__checkInheritanceFromMap( aList, aMap, _sParentElement );
				}
			} else { // Adding default if present and if not parent found
				_sParentElement = aMap[ '*' ];
				if( _sParentElement && aList.indexOf( _sParentElement )==-1 ){
					aList.unshift( _sParentElement );
				}
			}
		}
		return aList;
	},

	getList: function( sType, oOptions ){
		// Default Options
		oOptions = extend( {
			bSkipInheritance: false,
			bUseAll: false
		}, oOptions );
		var _aFromProduct = null;
		var _aAll = null;
		switch( sType ){
			case 'modules':
				_aFromProduct = this.getCurrentProduct().getModules();
				_aAll = this.__oAll.aModules;
			break;
			case 'products':
				_aFromProduct = this.getCurrentProduct().getProducts();
				_aAll = this.__oAll.aProducts;
			break;
			case 'apps':
				_aFromProduct = this.getCurrentProduct().getApps();
				_aAll = this.__oAll.aApps;
			break;
			case 'themes':
				_aFromProduct = this.getCurrentProduct().getThemes();
				_aAll = this.__oAll.aThemes;
			break;
			case 'lowLvlImgs':
				_aFromProduct = this.getCurrentProduct().getLowLvlImgs();
				_aAll = this.__oAll.aLowLvlImgs;
			break;
			case 'lowLvlSrvs':
				_aFromProduct = this.getCurrentProduct().getLowLvlSrvs();
				_aAll = this.__oAll.aLowLvlSrv;
			break;
			default:
				_aFromProduct = [];
				_aAll = [];
			break;
		}
		// Getting list with inheritance or simple list
		var _aExtendedProduct = ( oOptions.bSkipInheritance ? _aFromProduct: this.addInheritanceToList( _aFromProduct, sType ) );
		var _aResult = [];
		// Deciding if using "All" or not
		if( oOptions.bUseAll ){
			for( var _iIndex in _aAll ){
				var _current = _aAll[ _iIndex ];
				var _oItem = null;
				switch( typeof _current ){
					case 'object':
						var _bChecked = false;
						for( var _iCurrentIndex in _aExtendedProduct ){
							_bChecked = ( _aExtendedProduct[ _iCurrentIndex ].name == _current.name ? true : false )
							if( _bChecked ){
								break;
							}
						}
						_oItem = {
							name: _current.name,
							value: _current.name,
							checked: _bChecked
						};
					break;
					default:
						_oItem = {
							name: _current,
							value: _current,
							checked: ( _aExtendedProduct.indexOf( _current ) == -1 ? false : true )
						};
					break;
				}
				_aResult.push( _oItem );
			}
		} else {
			_aResult = _aResult.concat( _aExtendedProduct );
		}
		return _aResult;
	},

	getSVNUsername: function(){
		return this.__oCurrentOptions.sSVNUsername;
	},

	getUseSVN: function(){
		return this.__oCurrentOptions.bUseSVN;
	},

	getSVNPassword: function(){
		return this.__oCurrentOptions.sSVNPassword;
	},

	getSVNRoot: function(){
		return this.__oCurrentOptions.sSVNRoot;
	},

	getClearCurrent: function(){
		return this.__oCurrentOptions.bClearCurrent;
	},

	getCurrentBranch: function(){
		return this.__oCurrentOptions.sCurrentBranch;
	},

	getCurrentRevision: function(){
		return this.__oCurrentOptions.iRevision;
	},
	isLatestRevision: function(){
		return this.__oCurrentOptions.bLatestRevision;
	},
	getSourceRoot: function(){
		return _oPathfinder.getSourceRoot();
	},
	getDevelopmentRoot: function(){
		return _oPathfinder.getDevelopmentRoot();
	},
	getReleaseRoot: function(){
		return _oPathfinder.getReleaseRoot();
	},
	// Remote SVN Path
	getRemoteSVNPath: function(){
		return this.getSVNRoot() + this.getCurrentBranch();
	},
	// Local Source/SVN Path "sRootPath/branch/revision/sSubDirectory"
	getCurrentLocalSVNPath: function( sSubDirectory, sRootPath ){
		return ( sRootPath ? sRootPath : this.getSourceRoot() ) + ( this.getUseSVN() ? this.getCurrentBranch() + '/' + ( this.isLatestRevision() ? 'latest/' : this.getCurrentRevision() + '/' ) : '' ) + ( sSubDirectory ? sSubDirectory : '' )
	},
	// Source
	getCurrentSourceRoot: function( sSubDirectory ){
		return this.__getCurrentProductPath( sSubDirectory, this.getSourceRoot() );
	},
	getCurrentSourceWebRoot: function(){
		//return this.getCurrentSourceRoot('www/');
		return this.getCurrentSourceRoot();
	},
	// Local Product / Development / Release Path
	__getCurrentProductPath: function( sSubDirectory, sRootPath ){
		//return  this.getCurrentLocalSVNPath( null, sRootPath ) + this.getCurrentBrand().getName() + '/' + this.getCurrentProduct().getName() + '/' + ( sSubDirectory ? sSubDirectory : '' );
		return this.getCurrentLocalSVNPath( null, sRootPath ) + '/' + ( sSubDirectory ? sSubDirectory : '' );
	},
	// Development
	getCurrentDevelopmentRoot: function( sSubDirectory ){
		return this.__getCurrentProductPath( sSubDirectory, this.getDevelopmentRoot() );
	},
	getCurrentDevelopmentWebRoot: function(){
		//return this.getCurrentDevelopmentRoot('www/');
		return this.getCurrentDevelopmentRoot();
	},
	// Release
	getCurrentReleaseRoot: function( sSubDirectory ){
		return this.__getCurrentProductPath( sSubDirectory, this.getReleaseRoot() );
	},
	getCurrentReleaseWebRoot: function(){
		//return this.getCurrentReleaseRoot('www/');
		return this.getCurrentReleaseRoot();
	},
	__getFilteredWebLists: function( oOptions ){
		// Default Options
		oOptions = extend( {
			bSkipInheritance: false
		}, oOptions );
		var _aResults = [ '', 'libs/' ]; // Root and libs
		var _aTmp = this.getList( 'modules', oOptions );
		for( var _iIndex in _aTmp ){ // modules/xxXXxx
			_aResults.push( 'modules/' + _aTmp[ _iIndex ] + '/' );
		}
		var _aTmp = this.getList( 'products', oOptions );
		for( var _iIndex in _aTmp ){ // products/xxXXxx
			_aResults.push( 'products/' + _aTmp[ _iIndex ] + '/' );
		}
		var _aTmp = this.getList( 'themes', oOptions );
		for( var _iIndex in _aTmp ){ // themes/xxXXxx
			_aResults.push( 'themes/' + _aTmp[ _iIndex ] + '/' );
		}
		var _aTmp = this.getList( 'apps', oOptions );
		for( var _iIndex in _aTmp ){ // apps/xxXXxx
			_aResults.push( 'Apps/' + _aTmp[ _iIndex ] + '/' );
		}
		return _aResults;
	},
	//__getWebFilters: function( sFilter, sRoot, bNegate, aDirs ){
	__getWebFilters: function( sFilter, oOptions ){
		// Default Options
		oOptions = extend( {
			sRoot: '',
			bNegate: false,
			bSkipInheritance: false,
			aDirs: null
		}, oOptions );
		//
		if( !oOptions.aDirs ){
			oOptions.aDirs =  this.__getFilteredWebLists( { bSkipInheritance: oOptions.bSkipInheritance } )
		}
		// Creting Filter list
		var _aWebFilters = [];
		//Adding Dirs Iflter
		for( var _iIndex in oOptions.aDirs ){
			var _sCurrentSubDir = oOptions.aDirs[ _iIndex ];
			_aWebFilters.push( ( oOptions.bNegate ? '!' : '' ) + oOptions.sRoot + _sCurrentSubDir + ( _sCurrentSubDir ? '**/' : '' ) + sFilter );
		}
		return _aWebFilters;
	},
	// Filters
	__getCurrentFilterExternal: function( sRoot, bNegate ) {
		return this.__getWebFilters( 'libs/External/**/*.*', { sRoot: sRoot, bNegate: bNegate } );
	},
	__getCurrentFilterJSExternal: function( sRoot, bNegate ) {
		return this.__getWebFilters( 'libs/External/**/*.js', { sRoot: sRoot, bNegate: bNegate } );
	},
	__getCurrentFilterJS: function( sRoot ){ // All JS except external libraries
		return this.__getCurrentFilterJSExternal( sRoot, true ).concat( this.__getWebFilters( '*.js', { sRoot: sRoot } ) );
	},
	__getCurrentFilterJSMap: function( sRoot ){
		return this.__getWebFilters( '*.map', { sRoot: sRoot } );
	},
	__getCurrentFilterHTMLExternal: function( sRoot, bNegate ) {
		return this.__getWebFilters( 'libs/External/**/*.html', { sRoot: sRoot, bNegate: bNegate } );
	},
	__getCurrentFilterHTML: function( sRoot ){
		return this.__getCurrentFilterHTMLExternal( sRoot, true ).concat( this.__getWebFilters( '*.html', { sRoot: sRoot } ) );
	},
	__getCurrentFilterPHP: function( sRoot ){
		return this.__getWebFilters( '*.php', { sRoot: sRoot } );
	},
	__getCurrentFilterCSSExternal: function( sRoot, bNegate ) {
		return this.__getWebFilters( 'libs/External/**/*.css', { sRoot: sRoot, bNegate: bNegate } );
	},
	__getCurrentFilterCSS: function( sRoot ){
		//return this.__getCurrentFilterCSSExternal( sRoot, true ).concat( this.__getWebFilters( '*.css', { sRoot: sRoot } ) );
		return this.__getWebFilters( '*.css', { sRoot: sRoot } );
	},
	__getCurrentFilterFont: function( sRoot ){
		return this.__getWebFilters( '*.{ttf,woff,woff2}', { sRoot: sRoot } );
	},
	__getCurrentFilterImagesExternal: function( sRoot, bNegate ) {
		return this.__getWebFilters( 'libs/External/**/*.{svg,jpg,png,gif}', { sRoot: sRoot, bNegate: bNegate } );
	},
	__getCurrentFilterImages: function( sRoot ){
		return this.__getCurrentFilterImagesExternal( sRoot, true ).concat( this.__getWebFilters( '*.{svg,jpg,png,gif}', { sRoot: sRoot } ) );
	},
	__getCurrentFilterSCSSExternal: function( sRoot, bNegate ) {
		return this.__getWebFilters( 'libs/External/**/*.scss', { sRoot: sRoot, bNegate: bNegate } );
	},
	__getCurrentFilterSCSS: function( sRoot ){
		return this.__getCurrentFilterSCSSExternal( sRoot, true ) // Ignoring Externals
			.concat( this.__getWebFilters( '*.scss', { sRoot: sRoot } ) )
			.concat( this.__getWebFilters( '_*.scss', { sRoot: sRoot, bNegate: true } ) ) // Ignoring file which starts with "_"
		;
	},
	__getCurrentFilterPHPLoadtemplate: function( sRoot ){
		return this.__getWebFilters( 'modules/system/loadtemplate.php', { sRoot: sRoot } );
	},
	__getCurrentFilterThemeTpls: function( sRoot ){
		return this.__getWebFilters( '*.tpl', { sRoot: sRoot } );
	},
	__getCurrentFilterThemeManifest: function( sRoot, bSkipInheritance ){
		return this.__getWebFilters( 'manifest.tpl', { sRoot: sRoot, bSkipInheritance: bSkipInheritance } );
	},
	getCurrentSourceFilterJS: function(){
		return this.__getCurrentFilterJS( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterJS: function(){
		return this.__getCurrentFilterJS( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterJSExternal: function(){
		return this.__getCurrentFilterJSExternal( this.getCurrentSourceWebRoot() );
	},
	getCurrentSourceFilterJSMap: function(){
		return this.__getCurrentFilterJSMap( this.getCurrentSourceWebRoot() );
	},
	getCurrentSourceFilterHTML: function(){
		return this.__getCurrentFilterHTML( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterHTML: function(){
		return this.__getCurrentFilterHTML( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterPHP: function(){
		return this.__getCurrentFilterPHP( this.getCurrentSourceWebRoot() );
	},
	getCurrentSourceFilterCSS: function(){
		return this.__getCurrentFilterCSS( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterCSS: function(){
		return this.__getCurrentFilterCSS( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterFont: function(){
		return this.__getCurrentFilterFont( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterFont: function(){
		return this.__getCurrentFilterFont( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterImages: function(){
		return this.__getCurrentFilterImages( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterImages: function(){
		return this.__getCurrentFilterImages( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterSCSS: function(){
		return this.__getCurrentFilterSCSS( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterSCSS: function(){
		return this.__getCurrentFilterSCSS( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterPHPLoadtemplate: function(){
		return this.__getCurrentFilterPHPLoadtemplate( this.getCurrentSourceWebRoot() );
	},
	getCurrentSourceFilterThemeTpls: function(){
		return this.__getCurrentFilterThemeTpls( this.getCurrentSourceWebRoot() );
	},
	getCurrentDevelopmentFilterThemeTpls: function(){
		return this.__getCurrentFilterThemeTpls( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentSourceFilterThemeManifest: function( bSkipInheritance ){
		return this.__getCurrentFilterThemeManifest( this.getCurrentSourceWebRoot(), bSkipInheritance );
	},
	getCurrentDevelopmentFilterThemeManifest: function(){
		return this.__getCurrentFilterThemeManifest( this.getCurrentDevelopmentWebRoot() );
	},
	getCurrentDevelopmentFilterExternal: function(){
		return this.__getCurrentFilterExternal( this.getCurrentDevelopmentWebRoot() );
	},
}

module.exports = new Packager();
