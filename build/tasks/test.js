var gulp = require('gulp');
var karma = require('karma').server;
var gulpTo5 = require('gulp-babel');
var gulpPlumber = require('gulp-plumber');
var gulpDebug = require('gulp-debug');
var gulpWebdriverUpdate = require('gulp-protractor').webdriver_update;
var gulpProtractor = require("gulp-protractor").protractor;

// for full documentation of gulp-protractor, please check https://github.com/mllrsohn/gulp-protractor
gulp.task( 'test-webdriver-update', gulpWebdriverUpdate );

// transpiles files in /test/e2e/src/ from es6 to es5 then copies them to test/e2e/dist/
gulp.task('test-build-e2e', function () {
  return gulp.src( 'test/e2e/src/*.js' )
    .pipe( gulpPlumber() )
    .pipe( gulpTo5() )
    .pipe( gulp.dest( 'test/e2e/dist/' ) );
});

// runs build-e2e task then runs end to end tasks using Protractor: http://angular.github.io/protractor/
gulp.task('test-e2e', ['test-webdriver-update', 'test-build-e2e'], function(cb) {
  return gulp.src( 'test/e2e/dist/' + "/*.js")
    .pipe( gulpProtractor({
        configFile: "test/protractor.conf.js",
        args: ['--baseUrl', 'http://127.0.0.1:9000']
    }) )
    .on('error', function(e) { throw e; });
});

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/../../test/karma.conf.js',
        singleRun: true
    }, function(e) {
        done();
    });
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('tdd', function (done) {
    karma.start({
        configFile: __dirname + '/../../test/karma.conf.js'
    }, function(e) {
        done();
    });
});

/**
 * Run test once with code coverage and exit
 */
gulp.task('cover', function (done) {
  karma.start({
    configFile: __dirname + '/../../karma.conf.js',
    singleRun: true,
    reporters: ['coverage'],
    preprocessors: {
      'test/**/*.js': ['babel'],
      'src/**/*.js': ['babel', 'coverage']
    },
    coverageReporter: {
      type: 'html',
      dir: 'build/reports/coverage'
    }
  }, function (e) {
    done();
  });
})
