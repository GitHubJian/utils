function toArray(list, start) {
    start = start || 0;
    let i = list.length - start;
    let ret = new Array(i);
    while (i--) {
        ret[i] = list[i + start];
    }
    return ret;
}

function Ctor() {}

Ctor.use = function (plugin) {
    let installedPlugins = this._installedPlugins || (this._installedPlugins = []);
    if (installedPlugins.indexOf(plugin) > -1) {
        return this;
    }

    // additional parameters
    let args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
        plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this;
};

const CtorPlugin = {
    install: function (Ctor) {},
};
