const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
var gulpCopy = require('gulp-copy');
var webserver = require('gulp-webserver');


function buildStyles() {
  return gulp.src('./src/css/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(prefix({
			cascade: false
		}))
    .pipe(gulp.dest('./dist/css'));
};

function copyImages() {
  return gulp.src('./src/images/**/*')
    .pipe(gulpCopy('./dist/images', {prefix: 2}))
}

function copyHtml() {
  return gulp.src('./src/index.html')
    .pipe(gulpCopy('./dist', {prefix: 1}))
}

exports.buildStyles = buildStyles;

function watch() {
  const imagesWatcher = gulp.watch('./src/images/**/*');
  imagesWatcher.on('change', function(path, stats) {
      copyImages(); //styles task
  });
  const cssWatcher = gulp.watch('src/css/*.scss');
  cssWatcher.on('change', function(path, stats) {
    buildStyles();
  });
  const imagesWatchrt = gulp.watch('src/*.html');
  imagesWatchrt.on('change', function(path, stats) {
    copyHtml()
  });
}

exports.watch = watch

exports.build = async function() {
  await buildStyles()
  await copyImages()
  await copyHtml()
}

exports.webserver = function() {
  exports.build()
  watch()
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false,
      open: true,
      fallback: 'index.html'
    }));
}