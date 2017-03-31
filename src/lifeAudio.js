/**
 * @file 存储正在播放的音频，并分配id
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

let nextId = 1;
let idRecycled = [];
let audioMap = {};

function allocId() {
    if (idRecycled.length) {
        return idRecycled.shift();
    }
    return nextId ++;
}

function recycledId(id) {
    idRecycled.push(id);
}

function save(audioObject) {
    let id = allocId();
    audioMap.set(id, audioObject);
    return id;
}

function load(id) {
    if (audioMap.hasOwnProperty(id)) {
        return audioMap[id];
    }
    return null;
}

function release(id) {
    if (audioMap.hasOwnProperty(id)) {
        delete audioMap[id];
        recycledId(id);
    }
}

function getAll() {
    return [...audioMap.values()];
}

export default {
    save: save,
    load: load,
    release: release,
    getAll: getAll
}