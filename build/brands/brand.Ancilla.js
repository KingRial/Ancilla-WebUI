var Brand = require('../brand');
var _oPackager = require('../packager');

var _oBrand = new Brand( 'Ancilla', {
	sJSBuildType: 'system',
	sFramework: 'aurelia',
	aProducts : [],
	aModules : [],
	aThemes : [],
	aLowLvlImgs : [],
	aLowLvlSrv: [],
	//sJSBuildType: 'common',
	//sJsFramework: 'PHP'
	bUseSVN: false
});

/*
//Demo Aurelia
_oBrand.addProduct( 'Aurelia', {
	sLabel: 'Demo - Aurelia',
	aApps: [ [ 'Demo' ] ]
});
*/
//Ancilla
_oBrand.addProduct( 'Ancilla', {
	sLabel: 'Ancilla',
	//aApps: [ [ 'Ancilla', 'runtime' ], [ 'Ancilla', 'admin' ] ] // Product's Themes ( By Hiearchy order! )
	aApps: [ [ 'Ancilla' ] ]
});

_oPackager.addBrand( _oBrand );
