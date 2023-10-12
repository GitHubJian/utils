import {useEffect} from 'react';

/**
 * useLocationHash
 *
 * @desc 同步 location hash 内容
 *
 * @returns {[hash, updateHash]} [值, 更新值]
 */
export default function useLocationHash() {
    const [hash, setHash] = useState(() => window.location.hash);

    const onHashChangeListener = useCallback(() => {
        setHash(window.location.hash);
    }, []);

    useEffect(function () {
        window.addEventListener('hashchange', onHashChangeListener);

        return function () {
            window.removeEventListener('hashchange', onHashChangeListener);
        };
    });

    const updateHash = useCallback(
        function (newHash) {
            if (newHash !== hash) {
                window.location.hash = newHash;
            }
        },
        [hash]
    );

    return [hash, updateHash];
}
