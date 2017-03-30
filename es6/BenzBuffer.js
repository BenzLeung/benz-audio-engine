/**
 * @file 加载音频文件并缓存
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import ctx from './audioContext';
import bufferCache from './bufferCache';

class BenzBuffer {
    constructor(src) {
        let inCache = bufferCache.load(src);
        if (inCache) {
            return inCache;
        }
        this._src = src;
        this._buffer = ctx['createBuffer']();
        this._isLoaded = false;
        this._onLoadFuncQueue = [];
        bufferCache.save(src, this);
        this._load();
    }

    _load() {
        const request = new XMLHttpRequest();
        request.open('GET', this._src, true);
        request.responseType = 'arraybuffer';
        request.onload = function () {
            ctx['decodeAudioData'](request.response, function (data) {
                this._buffer = data;
                this._isLoaded = true;
                for (let i = 0, len = this._onLoadFuncQueue.length; i < len; i ++) {
                    let cb = this._onLoadFuncQueue[i];
                    if (typeof cb === 'function') {
                        cb();
                    }
                }
                this._onLoadFuncQueue = [];
            }, function(){
                //decode fail
                this._isLoaded = true;
                for (let i = 0, len = this._onLoadFuncQueue.length; i < len; i ++) {
                    let cb = this._onLoadFuncQueue[i];
                    if (typeof cb === 'function') {
                        cb();
                    }
                }
                this._onLoadFuncQueue = [];
            });
        }.bind(this);
        request.send();
    }

    onload(fn) {
        if (typeof fn !== 'function') {
            return;
        }
        if (this._isLoaded) {
            fn();
        } else {
            this._onLoadFuncQueue.push(fn);
        }
    }

    getBuffer() {
        return this._buffer;
    }
}

export default BenzBuffer;