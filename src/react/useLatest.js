import {useRef} from 'react';

export default function useLatest(v) {
    const ref = useRef(v);
    ref.current = v;

    return ref;
}
