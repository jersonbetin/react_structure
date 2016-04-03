var gulp = require('gulp');
//cargar el servidor
var webserver = require('gulp-webserver');
//convertir de ec6 a ec5 y jsx
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var inject = require('gulp-inject');
var wiredep = require('wiredep').stream;

gulp.task('server', function(){
    gulp.src('./dist')
        .pipe(webserver({
            host : '0.0.0.0',
            port : 3000,
            fallback : 'index.html',
            livereload : true
        }));
});


gulp.task('build', function () {
     browserify({
        entries : './src/components/index.jsx',
        extensions : ['.jsx'],
        debug : true
     })
     .transform(babelify, {presets: ['es2015', 'react']})
     .bundle()
     .pipe(source('bundle.js'))
     .pipe(gulp.dest('./dist/js'))
});

var path = {
    JS: './dist/js/**/*js',
    STYLE: './dist/stelesheeps/**/*.js',
    BOWER :'./dist/libs'
};

gulp.task('inject', function(){
    var sources = gulp.src([path.JS, path.STYLE],{read:false});
    return gulp.src('index.html', {cwd : './dist'})
        .pipe(inject(sources, {
            ignorePath: '/dist'
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('wiredep', function(){
    gulp.src('./dist/index.html')
        .pipe(wiredep({
            directory: path.BOWER
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', ['build'], function () {
    gulp.watch('src/components/**/*.jsx', ['build']);
    gulp.watch([path.STYLE], ['inject']);
    gulp.watch([path.JS], ['inject']);
    gulp.watch(['./bower.js'], ['wiredep']);
});


gulp.task('dev', ['server','watch']);