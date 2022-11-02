const gulp = require("gulp");
const del = require("del");
const fileInclude = require("gulp-file-include");
const imageMin = require("gulp-imagemin");
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const bs = require('browser-sync').create();

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
    lib_src: "src/js/lib/*.js",
    dest: "dist/js"
  },
  fonts: {
    src: "src/fonts/*",
    dest: "dist/fonts"
  },
  guide: {
    src: "src/guide/**/*",
    dest: "dist/guide"
  }
};

// clean js files
const cleanJsFiles = ["dist/js/*.js", "!dist/js/script.js", "!dist/js/lib.js"];

// clean
const clean = () => del(routes.base.dest);

// clean assets
const cleanAssets = assets => new Promise(resolve => resolve(del(assets)));

// index
const index = () =>
  gulp
  .src(routes.base.src)
  .pipe(gulp.dest(routes.base.dest));

// html
const html = async () => {
  await cleanAssets(routes.html.dest);
  gulp
    .src(routes.html.src)
    .pipe(fileInclude({
      prefix: "@@",
      basepath: "@file",
      context: {
        root: "..",
      }
    }))
    .pipe(gulp.dest(routes.html.dest));
}

// images
const images = async () => {
  await cleanAssets(routes.images.dest);
  gulp
    .src(routes.images.src)
    .pipe(imageMin())
    .pipe(gulp.dest(routes.images.dest));
}

// scss
const scss = () =>
  gulp
  .src(routes.scss.src)
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'compressed'
  }).on("error", sass.logError))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest(routes.scss.dest));

// js
const js = async () => {
  await cleanAssets(cleanJsFiles);
  gulp
    .src(routes.js.src)
    .pipe(gulp.dest(routes.js.dest));
}

// js library
const jsLib = async () => {
  await cleanAssets(cleanJsFiles);
  gulp
    .src(routes.js.lib_src)
    .pipe(sourcemaps.init())
    .pipe(concat('lib.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(routes.js.dest));
}

// fonts
const fonts = () =>
  gulp
  .src(routes.fonts.src)
  .pipe(gulp.dest(routes.fonts.dest));

// guide
const guide = () =>
  gulp
  .src(routes.guide.src)
  .pipe(gulp.dest(routes.guide.dest));

// browser sync
const browserSync = () =>
  bs.init({
    server: {
      baseDir: routes.base.dest
    }
  });

// watch
const watch = () => {
  gulp.watch(routes.base.src, index).on('change', bs.reload);
  gulp.watch(routes.html.watch, html).on('change', bs.reload);
  gulp.watch(routes.images.src, images).on('change', bs.reload);
  gulp.watch(routes.scss.watch, scss).on('change', bs.reload);
  gulp.watch(routes.js.src, js).on('change', bs.reload);
  gulp.watch(routes.js.lib_src, jsLib).on('change', bs.reload);
  gulp.watch(routes.fonts.src, fonts).on('change', bs.reload);
  gulp.watch(routes.guide.src, guide).on('change', bs.reload);
}

const prepare = gulp.series([clean]);
const assets = gulp.series([index, html, images, scss, js, jsLib, fonts, guide]);
const postDev = gulp.parallel([browserSync, watch]);

gulp.task("default",
  gulp.series([prepare, assets, postDev])
);

gulp.task("build",
  gulp.series([prepare, assets])
);