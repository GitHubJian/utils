import {useState, useCallback} from 'react';

/**
 * useLocalStroge
 *
 * @desc 获取 localstroge 中的数据
 *
 * @param {string} key 字段
 * @param {any} initialValue 初始值
 *
 * @returns
 */
export function useLocalStroge(key, initialValue) {
    const [value, setValue] = useState(function () {
        const currentValue = window.localStorage.getItem(key);

        return currentValue ? JSON.parse(currentValue) : initialValue;
    });

    const updateValue = useCallback(function (value) {
        setValue(value);

        window.localStorage.setItem(key, JSON.stringify(value));
    });

    return [value, updateValue];
}
