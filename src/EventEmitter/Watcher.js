// 观察者模式

function Dep() {
    this.watchers = [];
}

Dep.prototype.add = function add(watcher) {
    this.watchers.push(watcher);
};

Dep.prototype.remove = function remove(watcher) {
    if (this.watchers.length) {
        let index = this.watchers.indexOf(watcher);
        if (index > -1) {
            this.watchers.splice(index, 1);
        }
    }
};

Dep.prototype.notify = function notify() {
    let watchers = this.watchers.slice();

    for (let i = 0, l = watchers.length; i < l; i++) {
        watchers[i].update();
    }
};

function Watcher(cb) {
    this.cb = cb;
}

Watcher.prototype.update = function update() {
    this.cb();
};
