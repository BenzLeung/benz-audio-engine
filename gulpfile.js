/**
 * @file Gulp File
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/2/4
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var bump = require('gulp-bump');
var rollup = require('gulp-rollup');

gulp.task('roll-es6', function () {
    gulp.src(['./src/*.js'])
        .pipe(rollup({
            "format": "es",
            entry: './src/benzAudioEngine-es6.js'
        }))
        .pipe(rename('benzAudioEngine-es6.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('roll', function () {
    gulp.src(['./src/*.js'])
        .pipe(rollup({
            "format": "iife",
            "plugins": [
                require("rollup-plugin-babel")({
                    "presets": [["es2015", { "modules": false }]],
                    "babelrc": false,
                    "plugins": ["external-helpers"]
                })
            ],
            "moduleName": "benzAudioEngine",
            entry: './src/benzAudioEngine-es6.js'
        }))
        .pipe(rename('benzAudioEngine.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('roll-uglify', ['roll'], function () {
    gulp.src('benzAudioEngine.js')
        .pipe(uglify())
        .pipe(rename('benzAudioEngine.min.js'))
        .pipe(gulp.dest('.'));
});

gulp.task('old-uglify', function () {
    gulp.src('./old-ver/benzAudioEngine.js')
        .pipe(uglify())
        .pipe(rename('benzAudioEngine.min.js'))
        .pipe(gulp.dest('./old-ver'));
});

gulp.task('bump', function () {
    var date = new Date();
    gulp.src(['package.json', 'benzAudioEngine.js', 'src/benzAudioEngine-es6.js'])
        .pipe(bump())
        .pipe(replace(/@date ([0-9\/]+)/, '@date ' + date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()))
        .pipe(gulp.dest('.'));
});

gulp.task('default', ['roll-es6', 'roll-uglify', 'bump']);
