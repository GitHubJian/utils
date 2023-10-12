/**
 * useLockFn
 *
 * @desc 函数锁，同一时间函数只能执行一次
 *
 * @param {function} fn
 *
 * @returns
 */
export function useLockFn(fn) {
    const lockRef = useRef();

    const cb = useCallback(
        async function (...args) {
            if (lockRef.current) {
                return;
            }

            lockRef.current = true;

            const ret = await fn(...args);

            lockRef.current = false;

            return ret;
        },
        [fn]
    );

    return cb;
}
