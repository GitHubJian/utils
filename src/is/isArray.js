function _isArray(v) {
    if (
        v instanceof Array ||
        (!(v instanceof Object) && Object.prototype.toString.call(v) == '[object Array]') ||
        (typeof v.length === 'number' &&
            typeof v.splice !== 'undefined' &&
            typeof v.propertyIsEnumerable !== 'undefined' &&
            !v.propertyIsEnumerable('splice'))
    ) {
        return true;
    }
    return false;
}

function isArray(v) {
    if (!Array.isArray) {
        return _isArray(v);
    }
    return Array.isArray(v);
}
