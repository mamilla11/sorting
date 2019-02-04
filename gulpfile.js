"use strict";

var gulp = require("gulp");
var babel = require("gulp-babel");
var del = require("del");
var rename = require("gulp-rename");
var posthtml = require("gulp-posthtml"); 
var include = require("posthtml-include"); 
var htmlmin = require("gulp-htmlmin"); 
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var svgmin = require("gulp-svgmin");
//var uglify = require("gulp-uglify");
var uglifyes = require('uglify-es');
var composer = require('gulp-uglify/composer');
var uglify = composer(uglifyes, console);

var server = require("browser-sync").create();

gulp.task("clean", function() {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src("source/fonts/**/*.{woff,woff2}", {
    base: "source"
    })
    .pipe(gulp.dest("build"));
});

gulp.task("css", function () {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("html", function() {
  return gulp.src("source/*.html")
    .pipe(posthtml([include()]))
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"))
});

gulp.task("svg", function() {
  return gulp.src("source/img/**/*.svg", {
    base: "source"
    })
    .pipe(svgmin())
    .pipe(gulp.dest("build"))
});

gulp.task("js", function() {
  return gulp.src("source/js/**/*.js", {
    base: "source"
    })
    .pipe(uglify())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest("build"))
});

gulp.task("server", function () {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.task("refresh", function(done) {
    server.reload();
    done();
  });

  gulp.watch("source/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch("source/img/**/*.svg", gulp.series("svg", "refresh"));
  gulp.watch("source/js/**/*.js", gulp.series("js", "refresh"));
  gulp.watch("source/*.html", gulp.series("html", "refresh"));
});

gulp.task("build", gulp.series("clean", "copy", "css", "svg", "html", "js"));
gulp.task("start", gulp.series("build", "server"));
