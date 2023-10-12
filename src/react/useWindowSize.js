import {useState, useLayoutEffect} from 'react';

export default function useWindowSize() {
    const [size, setSize] = useState({
        width: null,
        height: null,
    });

    useLayoutEffect(function () {
        function handler() {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        }

        handler();
        window.addEventListener('resize', handler);

        return () => {
            window.removeEventListener('resize', handler);
        };
    }, []);

    return size;
}
