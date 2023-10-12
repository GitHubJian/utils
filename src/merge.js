function isFunction(v) {
    return 'function' === typeof v;
}

function isPlainObject(v) {
    return Object.prototype.toString.call(v) === '[object Object]';
}

function isArray(v) {
    return Array.isArray(v);
}

function extend() {
    let clone;
    let options;
    let name;
    let copy;
    let deep = false;

    let src;

    let copyIsArray;

    let target = arguments[0] || {};

    let i = 1;

    let length = arguments.length;

    if (typeof target === 'boolean') {
        deep = target;

        target = arguments[i] || {};

        i++;
    }

    if (typeof target !== 'object' && !isFunction(target)) {
        target = {};
    }

    for (; i < length; i++) {
        if ((options = arguments[i]) != null) {
            for (name in options) {
                copy = options[name];

                if (name === '__proto__' || target === copy) {
                    continue;
                }

                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                    src = target[name];

                    if (copyIsArray && isArray(src)) {
                        clone = [];
                    } else if (!copyIsArray && !isPlainObject(src)) {
                        clone = {};
                    } else {
                        clone = src;
                    }

                    copyIsArray = false;

                    target[name] = extend(deep, clone, copy);
                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }
    }

    return target;
}

function clone(v) {
    return extend(true, {}, v);
}
