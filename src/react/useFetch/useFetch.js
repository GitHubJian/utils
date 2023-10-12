import {useCallback, useEffect, useMemo, useState} from 'react';
import {useFetchContext} from './context';
import httpRequest from './httpRequest';

/**
 * useFetch
 *
 * @typedef {Object} config
 * @prop {boolean} abortOnUnmount 卸载时终止请求
 *
 * @returns {Object} res
 * @prop {function} request 发送请求的函数
 * @prop {boolean} success 是否成功
 * @prop {boolean} loading 是否正在加载
 * @prop {Object} response 请求后的数据集合
 */
function useFetch(config) {
    const {abortOnUnmount} = config || {abortOnUnmount: true};

    const {
        onSuccess: contextOnSuccess,
        onError: contextOnError,
        onRequest: contextOnRequest,
        onResponse: contextOnResponse,
        getAuthorizationHeader,
    } = useFetchContext();

    const [data, setData] = useState({
        success: undefined,
        loading: false,
        response: {},
        error: null,
    });

    const abortController = useMemo(function () {
        return new AbortController();
    }, []);

    const onSuccess = useCallback(
        function ({onSuccess: currentOnSuccess, response}) {
            if (contextOnResponse) {
                response = contextOnResponse(response);
            }

            if (contextOnSuccess) {
                contextOnSuccess(response);
            }

            if (currentOnSuccess) {
                currentOnSuccess(response);
            }

            setData(function (oldData) {
                return {
                    ...oldData,
                    success: true,
                    response: response,
                    loading: false,
                };
            });
        },
        [contextOnSuccess, contextOnResponse],
    );

    const onError = useCallback(
        function ({onError: currentOnError, error}) {
            if (contextOnResponse) {
                response = contextOnResponse(error);
            }

            if (contextOnError) {
                contextOnError(error);
            }

            if (currentOnError) {
                currentOnError(error);
            }

            setData(function (oldData) {
                return {
                    ...oldData,
                    success: true,
                    error: error,
                    loading: false,
                };
            });
        },
        [contextOnError, contextOnResponse],
    );

    const request = useCallback(
        function (options) {
            const {
                url,
                onSuccess: requestOnSuccess,
                onError: requestOnError,
                headers: requestHeaders,
                ...rest
            } = options;
            // ajax.beforeSend || axios.interceptors.request
            if (contextOnRequest) {
                contextOnRequest({
                    ...options,
                    url,
                });
            }

            setData(function (oldData) {
                return {
                    ...oldData,
                    loading: true,
                };
            });

            const authorizationHeader = getAuthorizationHeader ? getAuthorizationHeader() : undefined;

            const headers = {
                Authorization: authorizationHeader,
                ...requestHeaders,
            };

            if (!headers.Authorization) {
                delete headers.Authorization;
            }

            return httpRequest({
                ...rest,
                url: url,
                headers: headers,
            }).then(
                function (res) {
                    onSuccess({
                        onSuccess: requestOnSuccess,
                        response: res,
                        error: null,
                    });
                },
                function (error) {
                    onError({
                        onError: requestOnError,
                        response: null,
                        error: error,
                    });
                },
            );
        },
        [getAuthorizationHeader, onSuccess, onError, setData, contextOnRequest],
    );

    useEffect(
        function () {
            return function () {
                if (abortOnUnmount) {
                    abortController.abort();
                }
            };
        },
        [abortController.abort, abortOnUnmount],
    );

    return {
        request,
        ...data,
    };
}

export default useFetch;
