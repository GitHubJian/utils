import {useEffect} from 'react';

export default function useUnmount(fn) {
    const fnRef = useRef(fn);
    fnRef.current = fn;

    useEffect(
        function () {
            return function () {
                fnRef.current();
            };
        },
        [fn],
    );
}
