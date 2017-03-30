/**
 * @file 公共的 Web Audio API Context
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

const AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

let ctx = null;
let volumeNode;
let compressor;
let isMuted = false;
let volumeBeforeMuted = 1.0;

/*let emptyFunc = () => {};
ctx.setGlobalVolume = emptyFunc;
ctx.getGlobalVolume = emptyFunc;
ctx.setGlobalMuted = emptyFunc;
ctx.getGlobalMuted = emptyFunc;
ctx.desNode = null;*/

if (AudioContext) {
    ctx = new AudioContext();
    volumeNode = ctx['createGain']();
    compressor = ctx['createDynamicsCompressor']();
    compressor['connect'](volumeNode);
    volumeNode['connect'](ctx['destination']);
    volumeNode['gain'].value = 1.0;
    ctx.desNode = compressor;

    ctx.setGlobalVolume = (vol) => {
        if (!isMuted) {
            volumeNode['gain'].value = vol;
        }
        volumeBeforeMuted = vol;
    };
    ctx.getGlobalVolume = () => {
        return volumeBeforeMuted;
    };
    ctx.setGlobalMuted = (muted) => {
        isMuted = muted;
        if (muted) {
            volumeNode['gain'].value = 0;
        } else {
            volumeNode['gain'].value = volumeBeforeMuted;
        }
    };
    ctx.getGlobalMuted = () => {
        return isMuted;
    }
}

export default ctx;