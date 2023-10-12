import {useState, useCallback} from 'react';

/**
 * useBoolean
 *
 * @desc 设置值的反转
 *
 * @param {boolean} initValue 初始值
 *
 * @returns {[value, updateValue]} [值, 更新值]
 */
export default function useBoolean(initValue) {
    if (typeof initValue !== 'boolean') {
        throw new Error(
            'useBoolean 钩子的参数 initValue 必须是一个 boolean 值'
        );
    }

    const [value, setValue] = useState(initValue);

    const updateValue = useCallback(function (val) {
        if (typeof val === 'boolean') {
            return setValue(val);
        }

        return setValue(function (v) {
            return !v;
        });
    }, []);

    return [value, updateValue];
}
