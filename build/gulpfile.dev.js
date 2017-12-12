const gulp = require('gulp')
const browserSync = require('browser-sync')
const reload = browserSync.reload
const gulpsync = require('gulp-sync')(gulp)
const $ = require('gulp-load-plugins')()

const SRC_DIR = 'src'
const SRC_VIEWS = SRC_DIR + '/views'
const SRC_JS = SRC_DIR + '/js'
const SRC_SCSS = SRC_DIR + '/scss'
const SRC_I18N = SRC_DIR + '/i18n'
const SRC_JS_FILE = 'src/js/*.js'

const DIST_DIR = 'dist'
const DIST_JS = DIST_DIR + '/static/js'
const DIST_CSS = DIST_DIR + '/static/css'
const DIST_IMG = DIST_DIR + '/static/img'
const DIST_FONT = DIST_DIR + '/static/font'
const DIST_TMP = DIST_DIR + '/tmp'
const DIST_TMP_HTML = DIST_TMP + '/html'
const DIST_TMP_JS = DIST_TMP + '/js'

function dev() {
    gulp.task('js-eslint',function(){
        return gulp.src([SRC_JS + '/*.js'])
            .pipe($.eslint({configFle:"./.eslintrc"}))
            .pipe($.eslint.format())
    })

    gulp.task('css-sass', function(){
        return gulp.src(SRC_SCSS + '/**/*.scss')
            .pipe($.sass())
            .pipe(gulp.dest(DIST_CSS))
            // .pipe(reload({stream: true}))
    })

    gulp.task('html-include', function () {
        return gulp.src(SRC_VIEWS + '/*.html')
            .pipe($.fileInclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest(DIST_DIR))
            // .pipe(reload({stream: true}))
    })

    gulp.task('js-es6', function() {
        return gulp.src(DIST_TMP_JS)
            .pipe($.concat('ui.js'))
            .pipe($.plumber())
            .pipe($.babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(DIST_JS))
    })

    gulp.task('js-es6-0', function() {
        return gulp.src([
            'src/js/components/base.js',
            'src/js/components/selectable.js',
            'src/js/components/draggable.js',
            'src/js/components/sortable.js',
            'src/js/components/resizable.js',
            'src/js/components/position.js',
            'src/js/components/alert.js',
            'src/js/components/button.js',
            'src/js/components/slider.js',
            'src/js/components/collapse.js',
            'src/js/components/dialog.js',
            'src/js/components/dropdown.js',
            //'src/js/modal.js',
            'src/js/components/tooltip.js',
            'src/js/components/popover.js',
            'src/js/components/scrollspy.js',
            'src/js/components/tab.js',
            'src/js/components/transition.js',
            // eUI 组件
            'src/box/box.js',
            'src/totop/totop.js'
            // 封装

            //'src/hover-dropdown.js'
        ])
            .pipe($.concat('ui.js'))
            .pipe($.plumber())
            .pipe($.babel({
                presets: ['es2015']
            }))
            .pipe(gulp.dest(DIST_JS))
    })

    gulp.task('js-es6-1', function() {
        return gulp.src(SRC_JS + '/*.js')
            .pipe(gulp.dest(DIST_TMP_JS))
    })

    gulp.task('img', function () {
        return gulp.src('static/img/*')
            .pipe(gulp.dest(DIST_IMG))
    })

    // TODO static copy
    gulp.task('res-copy', function() {
        return gulp.src('static/res/**/*')
            .pipe($.fileInclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest('dist/static/res'))
            // .pipe(reload({stream: true}))
    })


    gulp.task('js-copy', function() {
        return gulp.src('static/lib/**/*')
            .pipe($.fileInclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest('dist/static/lib'))
            // .pipe(reload({stream: true}))
    })

    gulp.task('static-copy', function() {
        return gulp.src('static/**/*')
            .pipe($.fileInclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest('dist/static'))
    })

    gulp.task('html-copy', function() {
        return gulp.src(SRC_VIEWS + '/index/*.html')
            .pipe($.fileInclude({
                prefix: '@@',
                basepath: '@file'
            }))
            .pipe(gulp.dest(DIST_DIR))
            // .pipe(reload({stream: true}))
    })

    gulp.task('reload', function() {
    })

    gulp.task('dev', gulpsync.sync([
        // 'clean-build',
        ['js-es6-0', 'js-es6-1'],
        ['html-include', 'res-copy', 'js-copy', 'js-eslint', 'css-sass', 'js-es6', 'img', 'static-copy'],
        ['html-copy']
    ]), function () {
        browserSync({
            server: {
                baseDir: DIST_DIR
            },
            port: 1235,
            notify: false,
            scrollProportionally: false
        })

        gulp.watch(SRC_SCSS + '/**/*.scss', ['css-sass', 'reload'])
        gulp.watch('static/img/*.png', ['img', 'reload'])
        gulp.watch(SRC_VIEWS + '/**/*.html', ['html-include', 'reload'])
        gulp.watch(SRC_DIR + '/components/*.html', ['html-include', 'reload'])
        gulp.watch(SRC_JS + '/*.js', ['js-eslint', 'reload'])
        gulp.watch([SRC_JS_FILE], ['js-es6', 'reload'])
    })
}

module.exports = dev
