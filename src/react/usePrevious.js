import {useEffect, useRef} from 'react';

/**
 * usePrevious
 *
 * @desc 使用最初始的值
 *
 * @param {any} initValue
 *
 * @returns {any} 值
 */
export default function usePrevious(initValue) {
    const ref = useRef();

    useEffect(() => {
        ref.current = initValue;
    });

    return ref.current;
}
