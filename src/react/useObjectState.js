import {useState, useCallback} from 'react';

/**
 * useObjectState
 *
 * @desc 对象级 state 的使用
 *
 * @param {object} initValue
 *
 * @returns {[state, updateState]} [数据, 更新数据]
 */
export default function useObjectState(initValue) {
    const [state, setState] = useState(initValue);

    const updateState = useCallback(function (params) {
        if (typeof params === 'function') {
            setState(function (oldState) {
                const newState = params(oldState);

                return {
                    ...oldState,
                    ...newState,
                };
            });
        } else if (typeof params === 'object') {
            setState(function (oldState) {
                return {
                    ...oldState,
                    ...params,
                };
            });
        }
    }, []);

    return [state, updateState];
}
