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
    constructor(src, buffer) {
        let inCache = bufferCache.load(src);
        if (inCache) {
            return inCache;
        }
        this._src = src;
        this._buffer = buffer || ctx['createBuffer'](1, 1, 22050);
        this._isLoaded = !!buffer;
        this._onLoadFuncQueue = [];
        bufferCache.save(src, this);
        if (!this._isLoaded) {
            this._load();
        }
    }

    _load() {
        const request = new XMLHttpRequest();
        request.open('GET', this._src, true);
        request.responseType = 'arraybuffer';
        request.onload = () => {
            ctx['decodeAudioData'](request.response, (data) => {
                this._buffer = data;
                this._isLoaded = true;
                for (let i = 0, len = this._onLoadFuncQueue.length; i < len; i ++) {
                    let cb = this._onLoadFuncQueue[i];
                    if (typeof cb === 'function') {
                        cb();
                    }
                }
                this._onLoadFuncQueue = [];
            }, () => {
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
        };
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

    createSprite(startTime, endTime, customName) {
        let name = customName || '';
        if (!name) {
            let i = 1;
            while (bufferCache.load(`${this._src}\$${i}`)) {
                i ++;
            }
            name = `${this._src}\$${i}`;
        }

        this.onload(() => {
            let sampleRate = this._buffer['sampleRate'];
            let startSample = Math.floor(sampleRate * startTime);
            let endSample = Math.ceil(sampleRate * endTime);
            let numberOfChannels = this._buffer['numberOfChannels'];

            let spriteBuffer = ctx['createBuffer'](numberOfChannels, endSample - startSample, sampleRate);
            for (let c = 0; c < numberOfChannels; c ++) {
                let target = spriteBuffer['getChannelData'](c);
                let source = this._buffer['getChannelData'](c);
                for (let s = startSample, t = 0; s < endSample; s ++, t ++) {
                    target[t] = source[s];
                }
            }

            new BenzBuffer(name, spriteBuffer);
        });
        return name;
    }
}

export default BenzBuffer;