import {useState} from 'react';
import {parse} from '../qs';

/**
 * useSearchParam
 *
 * @desc 从 URL 中获取参数
 *
 * @returns {[state]} 返回 search param
 */
export default function useSearchParam() {
    const [state] = useState(function () {
        return parse(window.location.search);
    });

    return [state];
}
