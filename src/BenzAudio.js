/**
 * @file
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

import ctx from './audioContext';
import bufferCache from './bufferCache';
import lifeAudio from './lifeAudio';

class BenzAudio {

    constructor(src, loopStart, loopEnd) {
        this._bufferObj = bufferCache.load(src);
        this._id = 0;
        this._startTime = 0;
        this._playedTime = 0;
        this._paused = true;
        this._source = null;
        this._loopStart = loopStart;
        this._loopEnd = loopEnd;
        if (this._bufferObj) {
            this._id = lifeAudio.save(this);
        }
    }

    _createNode() {
        if (!this._bufferObj) {
            return;
        }
        let buffer = this._bufferObj.getBuffer();
        if (!buffer) {
            return;
        }
        let s = ctx['createBufferSource']();
        s['buffer'] = buffer;
        s['connect'](ctx.desNode);
        s['onended'] = () => {
            if (!this._paused) {
                lifeAudio.release(this._id);
            }
        };
        if (this._loopEnd) {
            s['loop'] = true;
            s['loopStart'] = this._loopStart;
            s['loopEnd'] = this._loopEnd;
        }
        this._source = s;
    }

    play() {
        if (this._source && !this._paused) {
            return this._id;
        }
        this._paused = false;
        this._createNode();
        if (!this._source) {
            return 0;
        }
        this._startTime = ctx.currentTime - this._playedTime;
        if (this._source.start)
            this._source.start(0, this._playedTime);
        else if (this._source['noteGrainOn'])
            this._source['noteGrainOn'](0, this._playedTime);
        else
            this._source['noteOn'](0, this._playedTime);
        return this._id;
    }

    pause() {
        this._playedTime = ctx.currentTime - this._startTime;
        this._paused = true;
        if (this._loopEnd) {
            while (this._playedTime >= this._loopEnd) {
                this._playedTime -= (this._loopEnd - this._loopStart);
            }
        }
        if (this._source) {
            this._source.stop();
        }
    }

    stop() {
        this._paused = false;
        if (this._source) {
            this._source.stop();
        }
        lifeAudio.release(this._id);
    }
}

export default BenzAudio;