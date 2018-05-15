var path = require('path');
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');

var sassPath = 'src/assets/scss';
var cssPath = 'src/assets/css';

//静态资源版本号更新
var rev = require('gulp-rev');
var revCollector = require('gulp-rev-collector');

gulp.task('css',function(){
    return gulp.src('src/assets/css/*.*')
               .pipe(rev())
               .pipe(gulp.dest('dist/assets/css'))
               .pipe(rev.manifest())
               .pipe(gulp.dest('rev/css'))
})      

gulp.task('js',function(){
    return gulp.src("src/assets/js/**/**/*.*")
               .pipe(rev())
               .pipe(gulp.dest("dist/assets/js"))
               .pipe(rev.manifest())
               .pipe(gulp.dest('rev/js'))
})

gulp.task('img',function(){
  return gulp.src("src/assets/images/*.*")
             .pipe(rev())
             .pipe(gulp.dest("dist/assets/images"))
             .pipe(rev.manifest())
             .pipe(gulp.dest('rev/img'))
})

gulp.task('fav',function(){
  return gulp.src('src/*.ico')
  .pipe(gulp.dest('dist'))
})

/*
gulp.task('wechatpage',function(){
	return gulp.src('src/weChatPage/*.*')
	.pipe(rev())
	.pipe(gulp.dest('dist/weChatPage'))
	.pipe(rev.manifest())
	.pipe(gulp.dest('rev/weChatPage'))
})
*/

gulp.task('rev',['css','js','img','fav'],function(){
    return gulp.src(['rev/**/*.json','src/**/*.html'])
               .pipe(revCollector({
                   replaceReved: true
               })).pipe(gulp.dest('dist'))
})


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

