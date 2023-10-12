function Storage() {
    this.cache = new Map();
    this.callbacks = {};
}

Storage.prototype.set = function (key, value, expires = 60 * 1000) {
    if (this.cache.has(key)) {
        this.cache.delete(key);
    }

    const cache = {
        value: value,
        _expires: expires,
        _date: Date.now(),
    };

    this.cache.set(key, cache);

    const callbacks = this.callbacks[key] || [];

    for (let i = 0; i < callbacks.length; i++) {
        const callback = callbacks[i];

        callback.call(this, cache);
    }

    return true;
};

Storage.prototype.get = function (key) {
    const cache = this.cache.get(key);

    if (cache._date + cache._expires > Date.now()) {
        this.remove(key);

        return null;
    }

    return cache.value;
};

Storage.prototype.remove = function (key) {
    this.cache.delete(key);
};

Storage.prototype.clear = function () {
    this.cache.clear();
};

Storage.prototype.size = function () {
    return this.cache.size();
};

Storage.prototype.addListener = function (key, callback) {
    this.callbacks[key] = this.callbacks[key] || [];

    this.callbacks[key].push(callback);
};

Storage.prototype.on = Storage.prototype.addListener;

Storage.prototype.removeListener = function (key, callback) {
    const callbacks = this.callbacks[key] || [];
    if (callbacks.length) {
        let index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    } else {
        delete this.callbacks[key];
    }

    return true;
};

Storage.prototype.off = Storage.prototype.removeListener;
