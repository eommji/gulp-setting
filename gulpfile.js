const gulp = require("gulp");
const del = require("del");
const fileInclude = require("gulp-file-include");
const imageMin = require("gulp-imagemin");
const sass = require("gulp-sass");
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const bs = require('browser-sync').create();

sass.compiler = require("node-sass");

const routes = {
  base: {
    src: "src/*.html",
    dest: "dist"
  },
  html: {
    watch: "src/html/**/*.html",
    src: "src/html/*.html",
    dest: "dist/html"
  },
  images: {
    src: "src/images/*",
    dest: "dist/images"
  },
  scss: {
    watch: "src/scss/*.scss",
    src: "src/scss/style.scss",
    dest: "dist/css"
  },
  js: {
    src: "src/js/*.js",
    dest: "dist/js"
  },
  jsLib: {
    src: "src/js/lib/*.js"
  },
  fonts: {
    src: "src/fonts/*",
    dest: "dist/fonts"
  }
};

const cleanJsFiles = ["dist/js/*.js", "!dist/js/script.js", "!dist/js/lib.js"];

const clean = () => del(routes.base.dest);

const cleanAssets = assets => new Promise(resolve => resolve(del(assets)));

const index = () =>
  gulp
    .src(routes.base.src)
    .pipe(gulp.dest(routes.base.dest));

const html = async () => {
  await cleanAssets(routes.html.dest);
  gulp
    .src(routes.html.src)
    .pipe(fileInclude({
      prefix: "@@",
      basepath: "@file",
      context: {
        webRoot: "..",
      }
    }))
    .pipe(gulp.dest(routes.html.dest));
}

const images = async () => {
  await cleanAssets(routes.images.dest);
  gulp
    .src(routes.images.src)
    .pipe(imageMin({ verbose: true }))
    .pipe(gulp.dest(routes.images.dest));
}

const fonts = () =>
  gulp
    .src(routes.fonts.src)
    .pipe(gulp.dest(routes.fonts.dest));

const scss = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'compressed' }).on("error", sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(routes.scss.dest));

const js = async () => {
  await cleanAssets(cleanJsFiles);
  gulp
    .src(routes.js.src)
    .pipe(sourcemaps.init())
    .pipe(babel({ presets: ["@babel/env"] }))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.js.dest));
}

const jsLib = async () => {
  await cleanAssets(cleanJsFiles);
  gulp
    .src(routes.jsLib.src)
    .pipe(sourcemaps.init())
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.js.dest));
}

const browserSync = () =>
  bs.init({
    server: {
      baseDir: routes.base.dest
    }
  });

const watch = () => {
  gulp.watch(routes.base.src, index).on('change', bs.reload);
  gulp.watch(routes.html.watch, html).on('change', bs.reload);
  gulp.watch(routes.images.src, images).on('change', bs.reload);
  gulp.watch(routes.scss.watch, scss).on('change', bs.reload);
  gulp.watch(routes.js.src, js).on('change', bs.reload);
  gulp.watch(routes.jsLib.src, jsLib).on('change', bs.reload);
  gulp.watch(routes.fonts.src, fonts).on('change', bs.reload);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([index, html, images, fonts, scss, js, jsLib]);
const postDev = gulp.parallel([browserSync, watch]);

gulp.task("default",
  gulp.series([prepare, assets, postDev])
);