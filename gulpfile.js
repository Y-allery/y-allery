const gulp = require('gulp');

const { src, dest, watch, series, parallel } = require('gulp');
const sass       = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const twig       = require('gulp-twig');
const babel      = require("gulp-babel");
const eslint     = require('gulp-eslint');
const uglify     = require('gulp-uglify');
const concat     = require('gulp-concat');
const gutil      = require('gulp-util');
const browserify = require('gulp-browserify');
const babelify   = require('babelify');
const source     = require('vinyl-source-stream');
const buffer     = require('vinyl-buffer');
const plumber    = require('gulp-plumber');
const imagemin   = require('gulp-imagemin');
const autoprefixer = require('gulp-autoprefixer');

sass.compiler = require('node-sass');

const paths = {
    styles: {
        src: 'sass/**/*.scss',
        dest: 'assets/styles/'
    },
    images: {
        src: 'images/**/*',
        dest: 'assets/images/'
    },
    scripts: {
        src: 'js/**/*.js',
        dest: 'assets/js/'
    },
	twig: {
		src: 'layouts/**/*.twig',
		dest: './'
	}
};


function js_compile(){
	return gulp.src('js/customization.js')
		.pipe( eslint() )
		.pipe( eslint.format() )
		.pipe( eslint.failAfterError() )
	    .pipe(browserify({
	        transform: ['babelify'],
	    }))
		.pipe(plumber())
		.pipe(uglify())
		.pipe(gulp.dest(paths.scripts.dest))
		.on('error', gutil.log);
}


/*
 * Optimize images
 */
function optimizeImages() {
	return gulp.src(paths.images.src)
		.pipe(imagemin(
			[
				imagemin.gifsicle({interlaced: true}),
				imagemin.mozjpeg({quality: 75, progressive: true}),
				imagemin.optipng({optimizationLevel: 5}),
				imagemin.svgo({
					plugins: [
						{removeViewBox: true},
						{cleanupIDs: false}
					]
				})
			]
		))
		.pipe(gulp.dest(paths.images.dest))
}


function combile_libs_js(){
	return gulp.src([
			'js/modernizr-2.0.6.min.js',
			/*
			'js/jquery.min.js',
			'js/jquery.fancybox.min.js',
			'js/jquery.lazy.min.js',
			//'js/jquery.touchSwipe.min.js',
			'js/slick.js',
			 */
			'js/classie.js',
			'js/cbpScroller.js',

		])
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(paths.scripts.dest))
		.on('error', gutil.log);
}

function twigCompile(){
	return gulp.src(paths.twig.src)
		.pipe(twig())
		.pipe(gulp.dest(paths.twig.dest));
}



function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	    .pipe(autoprefixer(['last 2 versions', '> 1%'], { cascade: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest));
}


function watch2() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, combile_libs_js);
    gulp.watch(paths.scripts.src, js_compile);
    gulp.watch(paths.twig.src, twigCompile);
	// gulp.watch(paths.images.src, optimizeImages);
}

function build() {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.scripts.src, combile_libs_js);
    gulp.watch(paths.scripts.src, js_compile);
    gulp.watch(paths.twig.src, twigCompile);
	// gulp.watch(paths.images.src, optimizeImages);
}
function optimizeImg() {
	gulp.watch(paths.images.src, optimizeImages);
}

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.optimize = optimizeImg;
exports.watch = watch2;
exports.build = series(styles, combile_libs_js, js_compile, twigCompile, optimizeImages);