var PathFinder = function(){
	this.__oTags = {
		sRelativeSourcePath: 'source/',
		sRelativeDevelopmentPath: 'development/',
		sRelativeReleasePath: 'release/',
		sRelativeWebPath: 'www/'
	}
	// Init Root
	this.setRoot( 'Compiler/' );
}

PathFinder.prototype.setRoot = function( sPath ){
	this.sRoot = sPath;
	this.setSourceRoot( sPath + this.__oTags.sRelativeSourcePath );
	this.setDevelopmentRoot( sPath + this.__oTags.sRelativeDevelopmentPath );
	this.setReleaseRoot( sPath + this.__oTags.sRelativeReleasePath );
}
PathFinder.prototype.getRoot = function(){
	return this.sRoot;
}
PathFinder.prototype.setSourceRoot = function( sPath ){
	this.sSrcRoot = sPath;
	this.setSourceWebRoot( sPath + this.__oTags.sRelativeWebPath )
}
PathFinder.prototype.getSourceRoot = function(){
	return this.sSrcRoot;
}
PathFinder.prototype.setDevelopmentRoot = function( sPath ){
	this.sDevelopmentRoot = sPath;
	this.setDevelopmentWebRoot( sPath + this.__oTags.sRelativeWebPath )
}
PathFinder.prototype.getDevelopmentRoot = function(){
	return this.sDevelopmentRoot;
}
PathFinder.prototype.setReleaseRoot = function( sPath ){
	this.sReleaseRoot = sPath;
	this.setReleaseWebRoot( sPath + this.__oTags.sRelativeWebPath )
}
PathFinder.prototype.getReleaseRoot = function(){
	return this.sReleaseRoot;
}
PathFinder.prototype.setSourceWebRoot = function( sPath ){
	this.sSrcWebRoot = sPath;
}
PathFinder.prototype.getSourceWebRoot = function(){
	return this.sSrcWebRoot;
}
PathFinder.prototype.setDevelopmentWebRoot = function( sPath ){
	this.sDevelopmentWebRoot = sPath;
}
PathFinder.prototype.getDevelopmentWebRoot = function(){
	return this.sDevelopmentWebRoot;
}
PathFinder.prototype.setReleaseWebRoot = function( sPath ){
	this.sReleaseWebRoot = sPath;
}
PathFinder.prototype.getReleaseWebRoot = function(){
	return this.sReleaseWebRoot;
}

module.exports = new PathFinder();
