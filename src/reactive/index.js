const {noop} = require('./util');
const {Watcher} = require('./watcher');
const {observe} = require('./observer');
const {Dep} = require('./dep');

const sharedPropertyDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop,
};

function proxy(target, sourceKey, key) {
    sharedPropertyDefinition.get = function proxyGetter() {
        return this[sourceKey][key];
    };
    sharedPropertyDefinition.set = function proxySetter(val) {
        this[sourceKey][key] = val;
    };
    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initData(ctx) {
    let data = ctx.$options.data;
    data = ctx._data = data.call(ctx);

    const keys = Object.keys(data);
    let i = keys.length;
    while (i--) {
        const key = keys[i];

        proxy(ctx, '_data', key);
    }

    observe(data);
}

function initComputed(ctx, computed) {
    let watchers = (ctx._computedWatchers = Object.create(null));

    for (let key in computed) {
        let userDef = computed[key];
        let getter = userDef;

        watchers[key] = new Watcher(ctx, getter, noop);

        if (!(key in ctx)) {
            defineComputed(ctx, key, userDef);
        }
    }
}

function defineComputed(target, key) {
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;

    Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter(key) {
    return function computedGetter() {
        let watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (Dep.target) {
                watcher.depend();
            }

            return watcher.value;
        }
    };
}

function initWatch(ctx, watch) {
    for (let key in watch) {
        let handler = watch[key];

        new Watcher(ctx, key, handler);
    }
}

function Ctx(options) {
    this._init(options);
}

Ctx.prototype._init = function (options) {
    let ctx = this;

    ctx.$options = options;

    if (options.data) {
        initData(ctx);
    }

    if (options.computed) {
        initComputed(ctx, options.computed);
    }

    if (options.watch) {
        initWatch(ctx, options.watch);
    }
};

Ctx.prototype._render = function () {
    let ctx = this;
    let ref = ctx.$options;
    let render = ref.render;
    // 第一步，先生成 VNODE，此时也就是
    render.call(ctx);
};

Ctx.prototype.$mount = function () {
    let ctx = this;

    let updateComponent = function () {
        ctx._render();
    };

    new Watcher(ctx, updateComponent, noop);
};

module.exports = Ctx;
