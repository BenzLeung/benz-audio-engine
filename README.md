# Benz Audio Engine

这是一个简单的基于 Web Audio API 的音效引擎。

我开发这个音效引擎是因为我觉得 cocos2d-js 的音效引擎不好用。cocos2d-js 在移动端无法预先加载音频资源，不支持 sprite，也不支持循环节。

**2017/04/01 更新：** 现在支持 sprite 了，可以取出音频的其中一小段来播放。

This is a simple audio engine that base on Web Audio API.

I developed it because I think cocos2d-js sound engine is not convenient to use. Cocos2d-js can not preload audio resources on the mobile side.

**2017/04/01 Update:** Now support "Audio Sprite"! You can slice a piece of audio to play.

## Demo

中文版：[https://benzleung.github.io/benz-audio-engine/demo.html](https://benzleung.github.io/benz-audio-engine/demo.html)

English: [https://benzleung.github.io/benz-audio-engine/demo-eng.html](https://benzleung.github.io/benz-audio-engine/demo-eng.html)

## 快速指引 Quick Start

首先下载js文件并写入html：

First, download "benzAudioEngine.js" and quote to HTML: 

```html
<!-- 只需要下载一个js并引用 -->
<!-- Just use ONE js file only -->
<script src="path/to/benzAudioEngine.js"></script>
<!-- 也可以选择压缩版本 -->
<!-- or use the minified version -->
<script src="path/to/benzAudioEngine.min.js"></script>
```

然后加载音频文件：

Then, load the audio file:

```javascript
// 加载一个 MP3
// load an MP3 file
benzAudioEngine.load('path/to/audio-file.mp3', function() {
    // 加载完毕后回调
    // callback while loading is finish
});

// 加载多个 MP3
// load several MP3 files
benzAudioEngine.load(['path/to/audio1.mp3', 'path/to/audio2.mp3'], function() {
    // 所有加载完毕后回调（只回调一次）
    // callback while all files are loaded (callback only once)
});
```

然后播放：

Finally, play:

```javascript
benzAudioEngine.play('path/to/audio-file.mp3');
```

## API

(**Tips:** English Version in the **NEXT SECTION**)

```javascript
/**
 * 是否支持 Web Audio API
 * @return {boolean}
 */
var isSupport = benzAudioEngine.support();
```
```javascript
/**
 * 加载音频文件
 * @param {string|string[]} srcArray 音频文件路径（或者多个路径组成的数组）
 * @param {function} [callback] 所有音频文件加载完毕后的回调
 */
benzAudioEngine.load(srcArray, callback);
```
```javascript
/**
 * 建立 Audio Sprites。也就是把某个音频的某一小片段取出来。
 * @param {string} src 音频文件路径
 * @param {object} spriteData 使用一个固定格式定义小片段的名字、开始时间、结束时间
 *                 {
 *                    '名字1' : [开始时间, 结束时间],
 *                    '名字2' : [开始时间, 结束时间],
 *                    ...
 *                 }
 */
benzAudioEngine.sprite(src, spriteData);

// 示例：
benzAudioEngine.sprite('path/to/a.mp3', {
    'a.mp3$1' : [0.0, 1.5],
    'a.mp3$2' : [1.85, 2.63],
    'feel free to name the sprite' : [3.14, 6.66]
});
benzAudioEngine.play('a.mp3$1');
benzAudioEngine.play('a.mp3$2');
// 同样支持循环节
benzAudioEngine.play('feel free to name the sprite', 0.1, 3.1);
```
```javascript
/**
 * 卸载音频文件，释放内存
 * @param {string|string[]} srcArray 音频文件路径（或者多个路径组成的数组）
 */
benzAudioEngine.unload(srcArray);
```
```javascript
/**
 * 播放音频文件，若文件尚未加载，则不播放（不会自动加载，也不会返回任何提示，
 *      因为游戏音效宁可不发声也不要延时发声）
 * @param {string} src 音频文件路径
 * @param {number} [loopStart] 循环开始时间
 * @param {number} [loopEnd] 循环结束时间，若不指定，则音频只播放一次
 * @return {int} 返回一个ID值，这个ID值用于操作暂停和停止，若不需要暂停和停止，
 *               则不需要理会这个返回值（不设置循环的话，音频播放完毕会自动停止）
 */
var id = benzAudioEngine.play(src, loopStart, loopEnd);
```
```javascript
/**
 * 暂停某个音频
 * @param {int} id 要暂停的音频的ID
 */
benzAudioEngine.pause(id);
```
```javascript
/**
 * 继续播放某个音频
 * @param {int} id 已经暂停的音频的ID
 */
benzAudioEngine.resume(id);
```
```javascript
/**
 * 停止某个音频
 * @param {int} id 要暂停的音频的ID
 */
benzAudioEngine.stop(id);
```
```javascript
/**
 * 设置音量，这是所有音频的统一音量，暂时没有对某个音频单独设置音量的功能
 * @param {number} vol 音量值，范围是 0.0 - 1.0
 */
benzAudioEngine.setVolume(vol);
```
```javascript
/**
 * 获得当前音量
 * @return {number} 音量，0.0 - 1.0
 */
var vol = benzAudioEngine.getVolume();
```
```javascript
/**
 * 设置静音，所有音频都静音，暂时没有对某个音频单独设置的功能
 * @param {boolean} muted 是否静音，true 为静音， false 为不静音
 */
benzAudioEngine.setMuted(muted);
```
```javascript
/**
 * 获得当前是否已静音
 * @return {boolean}
 */
var isMuted = benzAudioEngine.getMuted();
```
```javascript
/**
 * 暂停所有音频
 */
benzAudioEngine.pauseAll();
```
```javascript
/**
 * 停止所有音频
 */
benzAudioEngine.stopAll();
```

## API (English)

```javascript
/**
 * Check if the system support Web Audio API
 * @return {boolean}
 */
var isSupport = benzAudioEngine.support();
```
```javascript
/**
 * Load audio file(s)
 * @param {string|string[]} srcArray - Path to audio file, or an array of several
 *                                     file paths 
 * @param {function} [callback] - A callback when all files are loaded
 */
benzAudioEngine.load(srcArray, callback);
```
```javascript
/**
 * Create Audio Sprites. That is, a small piece of audio to take out.
 * @param {string} src - Path to audio file.
 * @param {object} spriteData - Use a fixed format to define the name,
 *                              the start time, and the end time of the sprite
 *                 {
 *                    'spriteName1' : [startTime, endTime],
 *                    'spriteName2' : [startTime, endTime],
 *                    ...
 *                 }
 */
benzAudioEngine.sprite(src, spriteData);

// 示例：
benzAudioEngine.sprite('path/to/a.mp3', {
    'a.mp3$1' : [0.0, 1.5],
    'a.mp3$2' : [1.85, 2.63],
    'feel free to name the sprite' : [3.14, 6.66]
});
benzAudioEngine.play('a.mp3$1');
benzAudioEngine.play('a.mp3$2');
// also supported loop
benzAudioEngine.play('feel free to name the sprite', 0.1, 3.1);
```
```javascript
/**
 * release memory
 * @param {string|string[]} srcArray - Path to audio file, or an array of several
 *                                     file paths
 */
benzAudioEngine.unload(srcArray);
```
```javascript
/**
 * Play the audio file
 * If the file has not been loaded yet, give up playing
 *   (no automatically load, no error, no return)
 * It is because the sound effect in game would rather not sound
 *   and do not delay the sound
 * @param {string} src - Path to audio file
 * @param {number} [loopStart] - The starting time of the loop cycle (Optional)
 * @param {number} [loopEnd] - The ending time of the loop cycle (Optional)
 *                             If undefined, the audio play once and stop at the end
 * @return {int} - return an ID value. The value is used to control pause and stop.
 *                 If you do not need to pause and stop, then ignore the return value.
 */
var id = benzAudioEngine.play(src, loopStart, loopEnd);
```
```javascript
/**
 * Pause an audio
 * @param {int} id - The ID of audio you want to pause
 */
benzAudioEngine.pause(id);
```
```javascript
/**
 * Resume a paused audio
 * @param {int} id - The ID of audio that is paused
 */
benzAudioEngine.resume(id);
```
```javascript
/**
 * Stop an audio
 * @param {int} id - The ID of audio you want to stop
 */
benzAudioEngine.stop(id);
```
```javascript
/**
 * Set the volume.
 * This is a unified volume for all audio, and there is no function to 
 *   set the volume for a particular audio
 * @param {number} vol - Volume value. The range is from 0.0 to 1.0
 */
benzAudioEngine.setVolume(vol);
```
```javascript
/**
 * Get the current volume
 * @return {number} - Volume value. The range is from 0.0 to 1.0
 */
var vol = benzAudioEngine.getVolume();
```
```javascript
/**
 * Set mute.
 * All audio would be muted, there is no function for a particular audio set.
 * @param {boolean} muted - true: muted， false: unmuted
 */
benzAudioEngine.setMuted(muted);
```
```javascript
/**
 * Get whether to mute
 * @return {boolean}
 */
var isMuted = benzAudioEngine.getMuted();
```
```javascript
/**
 * Pause all audio
 */
benzAudioEngine.pauseAll();
```
```javascript
/**
 * Stop all audio
 */
benzAudioEngine.stopAll();
```

## 其他说明 Other note

- 建议使用 MP3 或 AAC(*.m4a) 格式的音频文件，它们的兼容性最好。（参考：[http://caniuse.com/#feat=mp3](http://caniuse.com/#feat=mp3) [http://caniuse.com/#feat=aac](http://caniuse.com/#feat=aac)）
- It is recommended to use audio files in MP3 or AAC (* .m4a) formats because of their compatibility. (reference:[http://caniuse.com/#feat=mp3](http://caniuse.com/#feat=mp3) [http://caniuse.com/#feat=aac](http://caniuse.com/#feat=aac))

## License

MIT license.
