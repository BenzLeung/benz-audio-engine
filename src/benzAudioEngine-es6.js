/**
 * @file 一个简单的声音引擎，基于 Web Audio API，es6版本
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * @license MIT
 * @version 0.2.3
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import ctx from './audioContext';
import bufferCache from './bufferCache';
import lifeAudio from './lifeAudio';
import BenzBuffer from './BenzBuffer';
import BenzAudio from './BenzAudio';

const emptyFunc = () => {};
let benzAudioEngine = {
    support: () => false,
    load: emptyFunc,
    unload: emptyFunc,
    play: emptyFunc,
    pause: emptyFunc,
    stop: emptyFunc,
    setVolume: emptyFunc,
    setMuted: emptyFunc,
    getMuted: () => true,
    pauseAll: emptyFunc,
    stopAll: emptyFunc
};

if (ctx) {
    benzAudioEngine = {

        /**
         * 是否支持 Web Audio API
         * @return {boolean}
         */
        support: () => true,

        /**
         * 加载音频文件
         * @param {string|string[]} srcArray 音频文件路径（或者多个路径组成的数组）
         * @param {function} [callback] 所有音频文件加载完毕后的回调
         */
        load: function (srcArray, callback) {
            if (!(srcArray instanceof Array)) {
                srcArray = [srcArray];
            }
            let loadedCount = 0;
            let buf;
            for (let i = 0, len = srcArray.length; i < len; i ++) {
                buf = new BenzBuffer(srcArray[i]);
                buf.onload(function () {
                    loadedCount ++;
                    if (loadedCount >= len) {
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }
                });
            }
        },

        /**
         * 卸载音频文件，释放内存
         * @param {string|string[]} srcArray 音频文件路径（或者多个路径组成的数组）
         */
        unload: function (srcArray) {
            if (!(srcArray instanceof Array)) {
                srcArray = [srcArray];
            }
            for (let s of srcArray) {
                bufferCache.release(s);
            }
        },

        /**
         * 播放音频文件，若文件尚未加载，则不播放（不会自动加载，也不会返回任何提示，
         *      因为游戏音效宁可不发声也不要延时发声）
         * @param {string} src 音频文件路径
         * @param {number} [loopStart] 循环开始时间
         * @param {number} [loopEnd] 循环结束时间，若不指定，则音频只播放一次
         * @return {int} 返回一个ID值，这个ID值用于操作暂停和停止，若不需要暂停和停止，
         *               则不需要理会这个返回值（不设置循环的话，音频播放完毕会自动停止）
         */
        play(src, loopStart, loopEnd) {
            let a = new BenzAudio(src, loopStart, loopEnd);
            return a.play();
        },

        /**
         * 暂停某个音频
         * @param {int} id 要暂停的音频的ID
         */
        pause(id) {
            let a = lifeAudio.load(id);
            if (a) {
                a.pause();
            }
        },

        /**
         * 继续播放某个音频
         * @param {int} id 已经暂停的音频的ID
         */
        resume(id) {
            let a = lifeAudio.load(id);
            if (a) {
                a.play();
            }
        },

        /**
         * 停止某个音频
         * @param {int} id 要暂停的音频的ID
         */
        stop(id) {
            let a = lifeAudio.load(id);
            if (a) {
                a.stop();
            }
        },

        /**
         * 设置音量，这是所有音频的统一音量，暂时没有对某个音频单独设置音量的功能
         * @param {number} vol 音量值，范围是 0.0 - 1.0
         */
        setVolume: function (vol) {
            ctx.setGlobalVolume(vol);
        },

        /**
         * 获得当前音量
         * @return {number} 音量，0.0 - 1.0
         */
        getVolume: function () {
            return ctx.getGlobalVolume();
        },

        /**
         * 设置静音，所有音频都静音，暂时没有对某个音频单独设置的功能
         * @param {boolean} muted 是否静音，true 为静音， false 为不静音
         */
        setMuted: function (muted) {
            ctx.setGlobalMuted(muted);
        },

        /**
         * 获得当前是否已静音
         * @return {boolean}
         */
        getMuted: function () {
            return ctx.getGlobalMuted();
        },

        /**
         * 暂停所有音频
         */
        pauseAll: function () {
            let all = lifeAudio.getAll();
            for (let a of all) {
                if (a) {
                    a.pause();
                }
            }
        },

        /**
         * 停止所有音频
         */
        stopAll: function () {
            let all = lifeAudio.getAll();
            for (let a of all) {
                if (a) {
                    a.stop();
                }
            }
        }
    };
}

export default benzAudioEngine;