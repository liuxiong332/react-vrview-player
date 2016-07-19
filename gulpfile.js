var gulp = require('gulp');
var webpack = require('webpack');
var gutil = require('gulp-util');
var spawn = require('child_process').spawn;
var path = require('path');
var babel = require('gulp-babel');
var del = require('del');
var gulpSequence = require('gulp-sequence');
var os = require('os');

function runCmd(name, args, options, callback) {
  name = os.platform() === "win32" ? name + '.cmd' : name;
  var filePath = path.resolve(__dirname, 'node_modules', '.bin', name);
  var cp = require('child_process').spawn(filePath, args || [], Object.assign({
    stdio: 'inherit',
    cwd: __dirname,
  }, options));
  cp.on('error', function(err) { callback(err); });
  cp.on('exit', function() { callback(); });
}

function runNodeCmd(fileName, options, callback) {
  var cp = require('child_process').spawn('node', [fileName], Object.assign({
    stdio: 'inherit'
  }, options));
  cp.on('error', function(err) { callback(err); });
  cp.on('exit', function() { callback(); });
}

gulp.task('clean', function() {
  return del([
    'lib/**/*',
    'dist/**/*'
  ]);
});

gulp.task('babel', ['clean'], function() {
	return gulp.src('src/**/*.js')
		.pipe(babel())
		.pipe(gulp.dest('lib/'));
});

function webpackBuild(config) {
  return function (cb) {
    webpack(config, function (err, stats) {
      gutil.log(stats.toString({ colors: true }));
      cb(err || stats.hasErrors() && new Error('webpack compile error'));
    });
  };
}

gulp.task('webpack', webpackBuild(require('./webpack-config-maker')({
  debug: true,
  devtool: 'eval',
})));

gulp.task('webpack:production', ['clean', 'babel'], webpackBuild(require('./webpack-config-maker')({
  minimize: true,
  longTermCaching: true,
})));

gulp.task('build', ['webpack:production']);

gulp.task('start', function(done) {
  runCmd('babel-node', ['./src/server/server.js'], {
    env: { NODE_ENV: 'development' }
  }, done);
});

gulp.task('run', function(done) {
  runNodeCmd('./lib/server/server.js', {
    env: { NODE_ENV: 'production' }
  }, done);
});
