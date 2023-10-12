function bind(otherThis) {
    if (typeof this !== 'function') {
        throw new TypeError('试图绑定的 otherThis 不可被调用');
    }

    let baseArgs = Array.prototype.slice.call(arguments, 1);
    let baseArgsLength = baseArgs.length;
    let fToBind = this;
    let fNOP = function () {};
    let fBound = function () {
        baseArgs.length = baseArgsLength;
        baseArgs.push.apply(baseArgs, arguments);
        return fToBind.apply(fNOP.prototype.isPrototypeOf(this) ? this : otherThis, baseArgs);
    };

    if (this.prototype) {
        fNOP.prototype = this.prototype;
    }

    fBound.prototype = new fNOP();

    return fBound;
}

Function.prototype.bind = bind;
