import {useEffect} from 'react';

export default function useMount(fn) {
    const fnRef = useRef(fn);
    fnRef.current = fn;

    useEffect(function () {
        fnRef.current();
    }, []);
}
