
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-clean-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;

var path = {
    build: {
        html: '../build/hotel_amarica/',
        css: '../build/hotel_amarica/style/',
        img: '../build/hotel_amarica/images/',
        packages: '../build/hotel_amarica/packages/'
    },
    src: {
        html: '*.html',
        style: 'style/style.scss',
        img: 'images/**/*.*',
        packages: 'packages/**/*.*'
    },
    watch: {
        html: '**/*.html',
        style: 'style/**/*.scss',
        img: 'images/**/*.*',
        packages: 'packages/**/*.*'
    },
    clean: './build/hotel_amarica/'
};

var config = {
    server: {
        baseDir: "../build/hotel_amarica"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "max_server"
};

gulp.task('webserver', function () {
    browserSync(config);
});

gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});


gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(sass({
            sourceMap: true,
            errLogToConsole: true
        }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(gulp.dest('style/'))
        .pipe(reload({stream: true}));
});

gulp.task('image:build', function () {
    gulp.src(path.src.img)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(reload({stream: true}));
});

gulp.task('packages:build', function() {
    gulp.src(path.src.packages)
        .pipe(gulp.dest(path.build.packages))
});

gulp.task('build', [
    'html:build',
    'style:build',
    'packages:build',
    'image:build'
]);


gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.packages], function(event, cb) {
        gulp.start('packages:build');
    });
});


gulp.task('default', ['build', 'webserver', 'watch']);