import gulp from 'gulp'
import autoprefixer from 'gulp-autoprefixer'
import cssbeautify from 'gulp-cssbeautify'
import removeComments from 'gulp-strip-css-comments'
import rename from 'gulp-rename'
import gulpSass from "gulp-sass"
import nodeSass from "sass";
const sass = gulpSass(nodeSass)
import cssnano from 'gulp-cssnano'
import rigger from 'gulp-rigger'
import uglify from 'gulp-uglify'
import plumber from 'gulp-plumber'
import panini from 'panini'
import imagemin from 'gulp-imagemin'
import del from 'del'
import sync from 'browser-sync'
import notify from 'gulp-notify'
const browserSync = sync.create()

const srcPath = 'src/'
const distPath = 'dist/'

const path = {
  build: {
    html: distPath,
    css: distPath + 'assets/css/',
    js: distPath + 'assets/js/',
    images: distPath + 'assest/images/',
    fonts: distPath + 'assets/fonts/'
  },
  src: {
    html: srcPath + '*.html',
    css: srcPath + 'assets/scss/index.scss',
    js: srcPath + 'assets/js/*.js',
    images: srcPath + 'assest/images/**/*.{jpg, png, jpeg, svg, gif, ico, webp, webmanifest}',
    fonts: srcPath + 'assets/fonts/**/*.{eot, woff, woff2, ttf, svg}'
  },
  watch: {
    html: srcPath + '**/*.html',
    css: srcPath + 'assets/scss/**/*.scss',
    js: srcPath + 'assets/js/**/*.js',
    images: srcPath + 'assest/images/**/*.{jpg, png, jpeg, svg, gif, ico, webp, webmanifest}',
    fonts: srcPath + 'assets/fonts/**/*.{eot, woff, woff2, ttf, svg}'
  },
  clean: './' + distPath
}

function html() {
  panini.refresh()
  return gulp.src(path.src.html, { base: srcPath })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: 'HTML Error',
          message: 'Error: <%= error.message %>'
        })(err)
        this.emit('end')
      }
    }))
    .pipe(panini({
      root: srcPath,
      layouts: srcPath + 'template/layouts',
      partials: srcPath + 'template/partials',
      data: srcPath + 'template/data'
    }))
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }))
}

function css() {
  return gulp.src(path.src.css, { base: srcPath + 'assets/scss/' })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: 'SCSS Error',
          message: 'Error: <%= error.message %>'
        })(err)
        this.emit('end')
      }
    }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(gulp.dest(path.build.css))
    .pipe(cssnano({
      zindex: false,
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(removeComments())
    .pipe(rename({
      suffix: '.min',
      extname: '.css'
    }))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.reload({ stream: true }))
}

function js() {
  return gulp.src(path.src.js, { base: srcPath + 'assets/js/' })
    .pipe(plumber({
      errorHandler: function (err) {
        notify.onError({
          title: 'JS Error',
          message: 'Error: <%= error.message %>'
        })(err)
        this.emit('end')
      }
    }))
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min',
      extname: '.js'
    }))
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.reload({ stream: true }))
}

function images() {
  return gulp.src('src/assets/images/*', { base: srcPath + 'assets/images/' })
    .pipe(imagemin([
      imagemin.gifsicle({ interlaced: true }),
      imagemin.mozjpeg({ quality: 75, progressive: true }),
      imagemin.optipng({ optimizationLevel: 5 }),
      imagemin.svgo({
        plugins: [
          { removeViewBox: true },
          { cleanupIDs: false }
        ]
      })
    ]))
    .pipe(gulp.dest('dist/assets/images/'))
    .pipe(browserSync.reload({ stream: true }))
}

function fonts() {
  return gulp.src('src/assets/fonts/*', { base: srcPath + 'assets/fonts/' })
    .pipe(browserSync.reload({ stream: true }))
}

function clean() {
  return del(path.clean)
}

function watchFiles() {
  gulp.watch([path.watch.html], html)
  gulp.watch([path.watch.css], css)
  gulp.watch([path.watch.js], js)
  gulp.watch([path.watch.images], images)
  gulp.watch([path.watch.fonts], fonts)
}

function serve() {
  browserSync.init({
    server: {
      baseDir: "./" + distPath
    }
  })
}

const build = gulp.series(clean, gulp.parallel(images, css, js, html, fonts))
const watch = gulp.series(build, gulp.parallel(watchFiles, serve))

export const htmlRun = html
export const cssRun = css
export const jsRun = js
export const imagesRun = images
export const fontsRun = fonts
export const cleanRun = clean

export const buildRun = build

export const watchRun = watch

gulp.task('default', watchRun)