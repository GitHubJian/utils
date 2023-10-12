function getTag(v) {
    if (v == null) {
        return v === undefined ? '[object Undefined]' : '[object Null]';
    }

    return Object.prototype.toString.call(value);
}

function isObjectLike(v) {
    return typeof v === 'object' && v !== null;
}

function isArguments(v) {
    return isObjectLike(v) && getTag(v) === '[object Arguments]';
}

function isFlattenable(v) {
    const spreadableSymbol = Symbol.isConcatSpreadable;

    return Array.isArray(v) || isArguments(v) || !!(v && v[spreadableSymbol]);
}

function baseFlatten(array, depth, predicate, isStrict, result) {
    predicate || (predicate = isFlattenable);
    result || (result = []);

    if (array == null) {
        return result;
    }

    for (const v of array) {
        if (depth > 0 && predicate(v)) {
            if (depth > 1) {
                baseFlatten(v, depth - 1, predicate, isStrict, result);
            } else {
                result.push(...v);
            }
        } else if (!isStrict) {
            result[result.length] = v;
        }
    }

    return result;
}

function flattenDepth(array, depth) {
    const length = array == null ? 0 : array.length;

    if (!length) {
        return [];
    }

    depth = depth === undefined ? 1 : +depth;

    return baseFlatten(array, depth);
}

function flattenDeep(array) {
    return flattenDepth(array, 1 / 0);
}

console.log(flattenDepth([1, 2, [3, 4, [5, [6]]]]));
