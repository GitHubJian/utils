const {parsePath} = require('./util');
const {pushTarget, popTarget} = require('./dep');
const {queueWatcher} = require('./scheduler');

let uid = 0;

class Watcher {
    // TODO deep sync
    constructor(ctx, expOrFn, cb) {
        this.ctx = ctx;

        this.cb = cb;
        this.id = ++uid;
        this.active = true;
        this.deps = [];
        this.newDeps = [];
        this.depIds = new Set();
        this.newDepIds = new Set();

        if (typeof expOrFn === 'function') {
            this.getter = expOrFn;
        } else {
            this.getter = parsePath(expOrFn);
        }

        this.value = this.get();
    }

    get() {
        pushTarget(this);
        let value;
        const ctx = this.ctx;
        try {
            value = this.getter.call(ctx, ctx);
        } catch (e) {
            console.log(e);
        } finally {
            popTarget();
            this.cleanupDeps();
        }
        return value;
    }

    addDep(dep) {
        const id = dep.id;
        if (!this.newDepIds.has(id)) {
            this.newDepIds.add(id);
            this.newDeps.push(dep);
            if (!this.depIds.has(id)) {
                dep.addSub(this);
            }
        }
    }

    cleanupDeps() {
        let i = this.deps.length;
        while (i--) {
            const dep = this.deps[i];
            if (!this.newDepIds.has(dep.id)) {
                dep.removeSub(this);
            }
        }
        let tmp = this.depIds;
        this.depIds = this.newDepIds;
        this.newDepIds = tmp;
        this.newDepIds.clear();
        tmp = this.deps;
        this.deps = this.newDeps;
        this.newDeps = tmp;
        this.newDeps.length = 0;
    }

    update() {
        queueWatcher(this);
    }

    run() {
        if (this.active) {
            const value = this.get();

            if (value !== this.value) {
                const oldValue = this.value;
                this.value = value;

                try {
                    this.cb.call(this.ctx, value, oldValue);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    }

    depend() {
        let i = this.deps.length;
        while (i--) {
            this.deps[i].depend();
        }
    }

    teardown() {
        if (this.active) {
            let i = this.deps.length;
            while (i--) {
                this.deps[i].removeSub(this);
            }

            this.active = false;
        }
    }
}

exports.Watcher = Watcher;
