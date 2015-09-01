"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect');  //run local dev server
var open = require('gulp-open'); //open a URL in a web browser
var browserify = require('browserify'); //bundles js
var reactify = require('reactify'); //transforms JSX to JS
var source = require('vinyl-source-stream');  //use conventional text streams with Gulp
var concat = require('gulp-concat'); //concatenates files
var lint = require('gulp-eslint'); //lint js files, including jsx

var config = {
	port: 9005,
	devBaseUrl: 'http://localhost',

	paths: {
		html: './src/*.html',
		js: './src/**/*.js',
		images: './src/images/*',
		dist: './dist',
		css: [
			'node_modules/bootstrap/dist/css/bootstrap.min.css',
			'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
			'node_modules/toastr/toastr.css'
		],
		mainJs: './src/main.js'
	}
};

//start a local dev server
gulp.task('connect', function() {
	connect.server({
		root: ['dist'],
		port: config.port,
		base: config.devBaseUrl,
		livereload: true
	});
});

gulp.task('open', ['connect'], function() {
	gulp.src('dist/index.html')
		.pipe(open({uri: config.devBaseUrl + ':' + config.port + '/'}));
});

//move html to output dir
gulp.task('html', function() {
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dist))
		.pipe(connect.reload());
});

gulp.task('js', function() {
	browserify(config.paths.mainJs)
		.transform(reactify)
		.bundle()
		.on('error', console.error.bind(console))
		.pipe(source('bundle.js'))
		.pipe(gulp.dest(config.paths.dist + '/scripts'))
		.pipe(connect.reload());
});

gulp.task('css', function() {
	gulp.src(config.paths.css)
		.pipe(concat('bundle.css'))
		.pipe(gulp.dest(config.paths.dist + '/css'));
});

gulp.task('images', function() {
	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dist + '/images'))
		.pipe(connect.reload());

		//fav icon?
		gulp.src('.src/favicon.ico')
			.pipe(gulp.dest(config.paths.dist));
});

gulp.task('watch', function() {
	gulp.watch(config.paths.html, ['html']);
	gulp.watch(config.paths.js, ['js', 'lint']);
})

gulp.task('lint', function() {
	return gulp.src(config.paths.js)
		.pipe(lint({config: 'eslint.config.json'}))
		.pipe(lint.format());
});

//default task
gulp.task('default', ['html', 'js', 'css', 'images', 'lint', 'open', 'watch']);
