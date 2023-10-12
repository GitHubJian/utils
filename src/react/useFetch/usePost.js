import useFetch from './useFetch';

function usePost(options) {
    const {request, ...rest} = useFetch(options);

    const postRequest = useCallback(
        function (payload) {
            return request({
                ...payload,
                type: 'POST',
            });
        },
        [request],
    );

    return {
        request: postRequest,
        ...rest,
    };
}

export default usePost;
