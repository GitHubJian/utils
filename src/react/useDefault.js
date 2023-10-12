import {useState} from 'react';

/**
 * useDefault
 * 
 * @desc 使用默认值
 * 
 * @param {any} initialValue 
 * @param {any} defaultValue 
 * @returns {[value, setValue]} [值, 设置值]
 */
export default function useDefault(initialValue, defaultValue) {
    const [value, setValue] = useState(initialValue);

    if (value === undefined || value === null) {
        return [defaultValue, setValue];
    }

    return [value, setValue];
}

export function createValue(
    initValue,
    defaultValue,
    checkValueValid = function (v) {
        return !(v === undefined || v === null);
    },
) {
    if (checkValueValid(initValue)) {
        return initValue;
    }

    return defaultValue;
}
