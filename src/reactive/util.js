function noop() {}
exports.noop = noop;

function parsePath(path) {
    const segments = path.split('.');
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) {
                return;
            }
            obj = obj[segments[i]];
        }
        return obj;
    };
}
exports.parsePath = parsePath;

function remove(arr, item) {
    if (arr.length) {
        let index = arr.indexOf(item);
        if (index > -1) {
            return arr.splice(index, 1);
        }
    }
}
exports.remove = remove;
