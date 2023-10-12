function stringToPath(str) {
    let len = str.length;
    let i = 0;
    let res = [];
    let word = '';

    function isSeparator(ch) {
        return ch == '.' || ch == '[' || ch == ']';
    }

    while (i < len) {
        let ch = str.charAt(i);
        if (isSeparator(ch) && word) {
            res.push(word);

            word = '';
        } else if (!isSeparator(ch)) {
            word += ch;
        }

        i++;
    }

    if (word) {
        res.push(word);
    }

    return res;
}

function castPath(v) {
    if (Array.isArray(v)) {
        return v;
    }

    return stringToPath(v);
}

function toKey(v) {
    return `${v}`;
}

function baseGet(obj, path) {
    path = castPath(path);

    let index = 0;
    const len = path.length;

    while (obj != null && index < len) {
        obj = obj[toKey(path[index])];

        index++;
    }

    return index && index == len ? obj : undefined;
}

function get(obj, path, defaultValue) {
    const result = obj == null ? undefined : baseGet(obj, path);
    return result === undefined ? defaultValue : result;
}

function isObject(v) {
    const type = typeof v;
    return v != null && (type === 'object' || type === 'function');
}

function isIndex(v) {
    const type = typeof v;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length && type === 'number' && v > -1 && v % 1 == 0 && v < length;
}

function baseSet(obj, path, value) {
    path = castPath(path);

    const len = path.length;
    const lastIndex = len - 1;

    let index = -1;
    let nested = obj;

    while (nested != null && ++index < len) {
        const key = toKey(path[index]);
        let newValue = value;

        if (index != lastIndex) {
            const objValue = nested[key];

            newValue = isObject(objValue) ? objValue : isIndex(path[index + 1]) ? [] : {};
        }

        nested[key] = newValue;
        nested = nested[key];
    }

    return obj;
}

function set(obj, path, value) {
    return obj == null ? obj : baseSet(obj, path, value);
}
