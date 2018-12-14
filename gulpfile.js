const gulp = require('gulp');
const merge = require('merge-stream');
const imagemin = require('gulp-imagemin');
const minifyCSS = require('gulp-minify-css');
const uglify = require('gulp-uglify');
const htmlbeautify = require('gulp-html-beautify');

gulp.task('build', function () {
	var imageminHandler = function(){
		return imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5})
		],{verbose: true});
	}
    var s1 = gulp.src('./*.php')
		.pipe(gulp.dest('dist/'));   

	var s2 = gulp.src(['./static/**/*.{png,jpg,jpeg,gif}'])
		.pipe(imageminHandler())
		.pipe(gulp.dest('dist/static'));   	
			
	var s3 = gulp.src('helps/*.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest('./dist/helps'));
	var s4 = gulp.src('helps/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('./dist/helps'));
	var s5 = gulp.src('./pxpay/*.php')
		.pipe(gulp.dest('dist/pxpay'));
    return merge( s1, s2, s3, s4, s5);
});

gulp.task('html-beautify', function(){
	var options = {
		indentSize: 2
	};	
	var s6 = gulp.src('./dist/helps/*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('dist/helps/'));
	var s7 = gulp.src('./dist/*.html')
		.pipe(htmlbeautify(options))
		.pipe(gulp.dest('dist/'));
	return merge( s6, s7 );	
});

gulp.task('default', ['build', 'html-beautify']);
