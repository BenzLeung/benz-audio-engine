/**
 * @file 缓存已经 load 过的 buffer
 * @author BenzLeung(https://github.com/BenzLeung)
 * @date 2017/3/30
 * Created by JetBrains PhpStorm.
 *
 * 每位工程师都有保持代码优雅的义务
 * each engineer has a duty to keep the code elegant
 */

let resList = {};

function save(src, bufferObject) {
    if (bufferObject) {
        resList[src] = bufferObject;
    }
}

function load(src) {
    if (resList.hasOwnProperty(src)) {
        return resList[src];
    }
    return null;
}

function release(src) {
    if (resList.hasOwnProperty(src)) {
        delete resList[src];
    }
}

export default {
    save: save,
    load: load,
    release: release
}