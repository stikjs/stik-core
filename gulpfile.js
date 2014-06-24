var gulp = require("gulp"),
    jasmine = require("gulp-jasmine"),
    header = require("gulp-header"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
    pkg = require("./package.json");

var d = new Date();
var releaseDate = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear()

var fileStack = [
  "src/setup.js",
  "src/injectable.js",
  "src/controller.js",
  "src/action.js",
  "src/context.js",
  "src/behavior.js",
  "src/boundary.js",
  "src/injector.js",
  "src/manager.js",
  "src/public.js"
];

var banner = "// Stik-core - Version: <%= pkg.version %> | From: <%= date %>\n"

gulp.task("test", function(){
  gulp.src("specs/*_spec.js")
      .pipe(jasmine());
});

gulp.task("pack", function(){
  gulp.src(fileStack)
      .pipe(concat("stik-core.js"))
      .pipe(header(banner, { pkg: pkg, date: releaseDate }))
      .pipe(gulp.dest("dist"))
      .pipe(concat("stik-core.min.js"))
      .pipe(uglify())
      .pipe(gulp.dest("dist"));
});
