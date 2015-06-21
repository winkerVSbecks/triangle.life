var colors = require('colors');
var concat = require('gulp-concat');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var minifyCss = require('gulp-minify-css');
var minifyHTML = require('gulp-minify-html');
var watch = require('gulp-watch');

var styles = [
  'node_modules/colors.css/css/colors.css',
  './css/styles.css'
];

gulp.task('css', function() {
  return gulp.src(styles)
          .pipe(concat('styles.min.css'))
          .pipe(minifyCss())
          .pipe(gulp.dest('./build'))
          .pipe(connect.reload());
});

gulp.task('img', function() {
  return gulp.src('./img/**/*')
          .pipe(gulp.dest('./build/img'))
          .pipe(connect.reload());
});

gulp.task('misc', function() {
  return gulp.src(['./CNAME', './LICENSE', './google34316d718c8bcc05.html'])
          .pipe(gulp.dest('./build'))
          .pipe(connect.reload());
});

gulp.task('index', function() {
  return gulp.src('./index.html')
          .pipe(minifyHTML({ spare:true }))
          .pipe(gulp.dest('./build'))
          .pipe(connect.reload());
});

gulp.task('build', ['index', 'img', 'css', 'misc']);

gulp.task('default', ['build'], function() {
  // Start a server
  connect.server({
    root: './build',
    port: 3000,
    livereload: true
  });
  console.log('[CONNECT] Listening on port 3000'.yellow.inverse);

  watch(['./css/**/*.css'], function () {
    gulp.start('css');
  });

  watch('./index.html', function () {
    gulp.start('index');
  });
});

gulp.task('gh-deploy', ['build'], function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages({
      remoteUrl: 'git@github.com:winkerVSbecks/triangle.life.git'
    }));
});
