import useFetch from './useFetch';

function useGet(options) {
    const {request, ...rest} = useFetch(options);

    const postRequest = useCallback(
        function (payload) {
            return request({
                ...payload,
                type: 'GET',
            });
        },
        [request],
    );

    return {
        request: postRequest,
        ...rest,
    };
}

export default useGet;
