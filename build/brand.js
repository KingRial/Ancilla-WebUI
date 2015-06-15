var extend = require( 'extend' );
var Product = require( './product' );

var Brand = function( sName, oOptions ){
	this.__sName = sName;
	this.__oDefault = extend( {
		sLabel : 'Default Label',
		bUseSVN: true,
		sBranch : 'Dlabs/iKon/v1.4.0',
		aProducts : [],
		aModules : [ 'bentel', 'camera', 'eib', 'eibdatalog', 'elmo', 'energy', 'konnect', 'lighting', 'logic', 'networx-nx', 'nfc', 'paradox-evo', 'pbx', 'pess', 'reporting', 'scenario', 'scripting', 'securforce', 'siemens-edp', 'sms', 'supervision', 'system', 'tecnoalarm', 'tutondo', 'vivaldi', 'voice' ],
		//aThemes : [ 'admin', 'core', 'ebony', 'ivory', 'ivory-ui' ],
		aThemes : [ 'admin', 'ebony', 'ivory' ],
		aApps: [],
		aLowLvlImgs : [ 'ikon-arm' ],
		aLowLvlSrv : [ { name: "dpadcgi", reboot: 1 }, { name: "dpadcmd", reboot: 0 }, { name: "dpadd", reboot: 0 }, { name: "dpadws", reboot: 1 }, { name: "eibd", reboot: 0 }, { name: "elmod", reboot: 0 }, { name: "genericserialreader", reboot: 0 }, { name: "genericserialwriter", reboot: 0 }, { name: "getserialnumber", reboot: 0 }, { name: "getserialnumberd", reboot: 0 }, { name: "getserialnumberdcmd", reboot: 0 }, { name: "resourcemonitor", reboot: 0 } ],
		sDependences : '',
		sPacketExtension : 'dpadU',
		sPlatform : 'ARM',
		sJSBuildType: 'common',
		sFramework: 'PHP'
	}, oOptions );

	this._aProducts = {};
}

Brand.prototype.getName = function(){
	return this.__sName;
}

Brand.prototype.addProduct = function( sName, oOptions ){
	this._aProducts[ sName ] = new Product( sName, extend( {}, this.__oDefault, oOptions ) );
}

Brand.prototype.getProduct = function( sName ){
	if( sName ){
		return this._aProducts[ sName ];
	} else {
		return this._aProducts;
	}
}

Brand.prototype.getProductsList = function(){
	var _aProductsList = [];
	for( var _sProduct in this._aProducts ){
		_aProductsList.push( { name: this._aProducts[ _sProduct ].getLabel(), value: _sProduct } );
	}
	return _aProductsList;
}

module.exports = Brand;
