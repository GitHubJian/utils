function LRUCache(capacity) {
    this.cache = new Map();
    this.capacity = capacity; // 最大缓存数
}

LRUCache.prototype.get = function (key) {
    if (this.cache.has(key)) {
        // 存在即更新
        let value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);

        return value;
    }

    return -1;
};

LRUCache.prototype.set = function (key, value) {
    if (this.cache.has(key)) {
        // 存在即更新（删除后加入）
        this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
        // 不存在即加入
        // 缓存超过最大值，则移除最近没有使用的
        // new Map().keys() 返回一个新的 Iterator 对象
        this.cache.delete(this.cache.keys().next().value);
    }

    this.cache.set(key, value);
};

LRUCache.prototype.clear = function () {
    this.cache.clear();
};

LRUCache.prototype.delete = function (key) {
    this.cache.delete(key);
};
