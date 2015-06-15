var Product = function( sName, oOptions ){
	this.__sName = sName;
	this.__oOptions = oOptions;
}

Product.prototype.getOptions = function(){
	return this.__oOptions;
}

Product.prototype.getName = function(){
	return this.__sName;
}

Product.prototype.getLabel = function(){
	return this.__oOptions.sLabel;
}

Product.prototype.getBranch = function(){
	return this.__oOptions.sBranch;
}

Product.prototype.getFramework = function(){
	return this.__oOptions.sFramework;
}

Product.prototype.getJsBuildType = function(){
	return this.__oOptions.sJSBuildType;
}

Product.prototype.getModules = function(){
	return this.__oOptions.aModules;
}

Product.prototype.getProducts = function(){
	return this.__oOptions.aProducts;
}

Product.prototype.getThemes = function(){
	return this.__oOptions.aThemes;
}

Product.prototype.getLowLvlImgs = function(){
	return this.__oOptions.aLowLvlImgs;
}

Product.prototype.getLowLvlSrvs = function(){
	return this.__oOptions.aLowLvlSrv;
}

Product.prototype.getApps = function(){
	return this.__oOptions.aApps;
}

Product.prototype.getUseSVN = function(){
	return this.__oOptions.bUseSVN;
}

module.exports = Product;
