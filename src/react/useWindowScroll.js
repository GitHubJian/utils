import {useState, useCallback, useLayoutEffect} from 'react';

/**
 * useWindowScroll
 *
 * @desc 窗口滚动，设置滚动位置
 *
 * @returns {[scroll, updateScroll]} scroll 值，更新 scroll 值
 */
export default function useWindowScroll() {
    const [scroll, setScroll] = useState({
        x: null,
        y: null,
    });

    const updateScroll = useCallback(function (...args) {
        if (typeof args[0] === 'object') {
            window.scrollTo(args[0]);
        } else if (typeof args[0] === 'number' && typeof args[1] === 'number') {
            window.scrollTo(args[0], args[1]);
        } else {
            throw new Error(
                'Invalid arguments passed to scrollTo. https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo',
            );
        }
    }, []);

    useLayoutEffect(function () {
        function handler() {
            setScroll({x: window.pageXOffset, y: window.pageYOffset});
        }

        handler();
        window.addEventListener('scroll', handler);

        return () => {
            window.removeEventListener('scroll', handler);
        };
    }, []);

    return [scroll, updateScroll];
}
