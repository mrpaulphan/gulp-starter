var gulp = require('gulp');
/*
 *  Gulp Plugins
 */
var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var rename = require('gulp-rename');
var scss = require('gulp-sass');
var browserSync = require('browser-sync').create();
var plumber = require('gulp-plumber');
var reload = browserSync.reload;
var dirSync = require('gulp-directory-sync');
var shell = require('gulp-shell')

/*
 *    Variables
 */
var paths = {
    "scss": {
        "src": [
            "source/scss/*.scss",
            "source/scss/**/*.scss"
        ],
        "dest": "public/css"
    },
    "js": {

        "src": "source/js/**/*.js",
        "dest": "public/js"
    },
    "fonts": {
        "src": "source/fonts",
        "dest": "public/fonts"
    },
    "svgs": {
        "src": "source/svgs",
        "dest": "public/svgs"
    }
};

var space= " ";

/*
 *  Styles Task
 */
gulp.task('styles', function() {
    gulp.src(paths.scss.src)
        .pipe(plumber())
        .pipe(scss({
            style: 'expanded',
            precision: 5,
            includePaths: [
                'node_modules/normalize.css',
                'node_modules/include-media/dist',
                '_source/scss/layouts'
            ]
        }))
        .pipe(autoprefixer({
            browsers: ['last 2 version', 'ie 11'],
            cascade: false
        }))
        .pipe(rename('screen.css'))
        .pipe(gulp.dest(paths.scss.dest))
        .pipe(browserSync.reload({
            stream: true
        })); // prompts a reload after compilation

});

/*
 *  Scripts Task
 */
gulp.task('scripts', function() {
    gulp.src(paths.js.src)
        .pipe(plumber())

    .pipe(browserify())
        .pipe(gulp.dest(paths.js.dest))
        .pipe(browserSync.reload({
            stream: true
        })); // prompts a reload after compilation

});
/*
 *  Server Task
 */
gulp.task('browser-sync', function() {
    browserSync.init({
        proxy: 'localhost:4000',
        port: 4000
    });
});

gulp.task('sync', shell.task([
    'echo "Cleaning up..."',
    'rm -rf ' + paths.fonts.dest + space + paths.svgs.dest,
    'echo "Syncing..."',
    'cp -R '+ paths.fonts.src+' '+paths.fonts.dest+'',
    'cp -R '+ paths.svgs.src+' '+paths.svgs.dest+''
]));

/*
 *  Watch Task
 */
gulp.task('watch', ['browser-sync'], function() {
    gulp.watch(paths.scss.src, ['styles']);
    gulp.watch(paths.js.src, ['scripts']);
    gulp.watch(paths.fonts.src, ['sync']);
    gulp.watch(['./templates/**/*.html']).on('change', reload);

});


/*
 *  Build Task
 */
gulp.task('dev', [
    'styles',
    'scripts',
    'sync',
    'watch'
]);
