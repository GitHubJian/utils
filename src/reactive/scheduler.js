const {nextTick} = require('./nextTick');

const queue = [];
let has = {};
let waiting = false;
let flushing = false;
let index = 0;

function resetSchedulerState() {
    index = queue.length = 0;
    has = {};
    waiting = flushing = false;
}

let currentFlushTimestamp = 0;
let getNow = Date.now;

function flushSchedulerQueue() {
    currentFlushTimestamp = getNow();
    flushing = true;
    let watcher;
    let id;

    queue.sort((a, b) => a.id - b.id);

    for (index = 0; index < queue.length; index++) {
        watcher = queue[index];
        id = watcher.id;
        has[id] = null;
        watcher.run();
    }

    resetSchedulerState();
}

function queueWatcher(watcher) {
    const id = watcher.id;

    if (has[id] == null) {
        has[id] = true;

        if (!flushing) {
            queue.push(watcher);
        } else {
            let i = queue.length - 1;
            while (i > index && queue[i].id > watcher.id) {
                i--;
            }
            queue.splice(i + 1, 0, watcher);
        }

        if (!waiting) {
            waiting = true;

            nextTick(flushSchedulerQueue);
        }
    }
}
exports.queueWatcher = queueWatcher;
