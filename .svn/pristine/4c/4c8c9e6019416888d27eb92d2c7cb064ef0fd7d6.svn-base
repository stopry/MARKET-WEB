var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var sassPath = './assets/scss';
var cssPath = './assets/css';

gulp.task('sass',function(){
  gulp.src(sassPath+'/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(cssPath))
});
gulp.watch([sassPath+'/*.scss'],function(){
  gulp.run('sass');
});

gulp.task('default',function(){
  gulp.run('sass');
});

