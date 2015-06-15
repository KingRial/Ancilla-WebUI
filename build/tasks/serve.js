var gulp = require('gulp');
var browserSync = require('browser-sync');

var _oPackager = require('../packager');

gulp.task('serve-development', ['build-development'], function(done) {
	browserSync({
		open: false,
		port: 9000,
		server: {
			baseDir: [ _oPackager.getCurrentDevelopmentWebRoot() ],
				middleware: function (req, res, next) {
				res.setHeader('Access-Control-Allow-Origin', '*');
				next();
			}
		}
	}, done);
});

gulp.task('serve-release', ['build-release'], function(done) {
	browserSync({
		open: false,
		port: 9000,
		server: {
			baseDir: [ _oPackager.getCurrentReleaseWebRoot() ],
				middleware: function (req, res, next) {
				res.setHeader('Access-Control-Allow-Origin', '*');
				next();
			}
		}
	}, done);
});
