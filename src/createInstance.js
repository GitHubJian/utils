function createInstance(fn) {
    let obj = {};

    obj.__proto__ = fn.prototype;

    let args = Array.prototype.slice.call(arguments, 1);

    fn.apply(obj, args);

    return obj;
}
