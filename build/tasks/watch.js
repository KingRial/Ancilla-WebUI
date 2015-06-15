var gulp = require('gulp');
var browserSync = require('browser-sync');

var _oPackager = require('../packager');

function reportChange(event){
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
}

gulp.task('watch', ['serve-development'], function() {
	gulp.watch( _oPackager.getCurrentSourceFilterJS(), [
				'build-js',
				browserSync.reload
			])
		.on('change', reportChange);
	gulp.watch( _oPackager.getCurrentSourceFilterHTML(), [
				'build-HTML',
				browserSync.reload
			])
		.on('change', reportChange);
	gulp.watch( _oPackager.getCurrentSourceFilterSCSS().concat( _oPackager.getCurrentSourceFilterCSS() ), [
			'build-CSS',
			browserSync.reload
		] )
		.on('change', reportChange);
		gulp.watch( _oPackager.getCurrentSourceFilterImages(), [
				'build-images',
				browserSync.reload
			] )
			.on('change', reportChange);
	/*
	gulp.watch( _oPackager.getCurrentSourceFilterPHP(), [
			'build-PHP',
			browserSync.reload
		] )
		.on('change', reportChange);
	*/
});

gulp.task('watch-release', ['serve-release'], function() {
	//TODO: how to handle this ?
});
