const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();
const del = require('del');

var setting = {
  autoprefixer: {
    // grid: 'autoplace'
  },
  browserSync: {
    server: {
      baseDir: 'httpdocs',
      proxy: 'localhost:3000'
    },
  },
  imagemin: {
    disabled: false,
    level: 7  // compressed ratio
  },
  minify: {
    css: false,
    js: false
  },
  path: {
    base: {
      src: 'src',
      dest: 'httpdocs'
    },
    sass: {
      src: 'src/assets/sass/**/*.scss',
      dest: 'httpdocs/assets/css/',
    },
    js: {
      src: 'src/assets/js/**/*.js',
      dest: 'httpdocs/assets/js/',
    },
    img: {
      src: 'src/assets/img/**/*.+(png|jpg|gif|svg)',
      dest: 'httpdocs/assets/img/',
    },
    lib: {
      src: 'src/assets/lib/**/*',
      dest: 'httpdocs/assets/lib/',
    },
    font: {
      src: 'src/assets/font/**/*',
      dest: 'httpdocs/assets/font/',
    },
    html: {
      src: ['src/**/*', '!src/assets/**/*']
    },
  }
};

// Optimize image
const img = () => {
  if (!setting.imagemin.disabled) {
    return gulp.src(setting.path.img.src)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
      }))
      .pipe(plugins.changed(setting.path.img.dest))
      .pipe(plugins.imagemin({ optimizationLevel: setting.imagemin.level }))
      .pipe(gulp.dest(setting.path.img.dest))
      .pipe(browserSync.reload({ stream: true }));
  } else {
    return gulp.src(setting.path.img.src)
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
      }))
      .pipe(plugins.changed(setting.path.img.dest))
      .pipe(gulp.dest(setting.path.img.dest))
      .pipe(browserSync.reload({ stream: true }));
  }
};

// SASS
const scss = () => {
  return gulp.src(setting.path.sass.src)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(sass().on('error', sass.logError))  // DartSass sass({outputStyle: 'compressed'})
    .pipe(plugins.autoprefixer(setting.autoprefixer))
    .pipe(gulp.dest(setting.path.sass.dest))
    .pipe(browserSync.stream({ once: true }));
}

// HTML
const html = () => {
  return gulp.src(
    setting.path.html.src,
    { base: setting.path.base.src }
  )
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(plugins.changed(setting.path.base.dest))
    .pipe(gulp.dest(setting.path.base.dest))
    .pipe(browserSync.reload({ stream: true }));
};

// JavaScript
const js = () => {
  return gulp.src(setting.path.js.src)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(plugins.changed(setting.path.js.dest))
    .pipe(gulp.dest(setting.path.js.dest))
    .pipe(browserSync.stream({ once: true }));
};

// Lib
const lib = () => {
  return gulp.src(setting.path.lib.src)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(plugins.changed(setting.path.lib.dest))
    .pipe(gulp.dest(setting.path.lib.dest))
    .pipe(browserSync.stream({ once: true }));
};

// Font
const font = () => {
  return gulp.src(setting.path.font.src)
    .pipe(plugins.plumber({
      errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
    }))
    .pipe(plugins.changed(setting.path.font.dest))
    .pipe(gulp.dest(setting.path.font.dest))
    .pipe(browserSync.stream({ once: true }));
};

// JS Minify
const jsminify = () => {
  if (setting.minify.js) {
    return gulp.src(setting.path.js.dest + '**/*.js')
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
      }))
      .pipe(plugins.uglify())
      .pipe(gulp.dest(setting.path.js.dest));
  }
};

// CSS Minify
const cssminify = () => {
  if (setting.minify.css) {
    return gulp.src(setting.path.sass.dest + '**/*.css')
      .pipe(plugins.plumber({
        errorHandler: plugins.notify.onError("Error: <%= error.message %>") //<-
      }))
      .pipe(plugins.csso())
      .pipe(gulp.dest(setting.path.sass.dest));
  }
};

// Clean
const clean = () => {
  return del(setting.path.sass.dest);
};

// Watch
const watch = () => {
  browserSync.init(setting.browserSync);

  gulp.watch(setting.path.html.src, html);
  gulp.watch(setting.path.sass.src, scss);
  gulp.watch(setting.path.js.src, js);
  gulp.watch(setting.path.lib.src, lib);
  gulp.watch(setting.path.font.src, font);
  gulp.watch(setting.path.img.src, img);
};

exports.default = gulp.series(watch);
exports.build = gulp.series(
  clean,
  gulp.parallel(html, scss, js, lib, font, img),
  gulp.parallel(cssminify, jsminify)
);