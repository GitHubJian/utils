import {FetchContext} from './context';

/**
 * Fetch Provider
 *
 * @typedef {object} options
 * @prop {ReactNode} children
 * @prop {function} getAuthorizationHeader
 * @prop {any} rest
 *
 * @returns
 */
function FetchProvider(options) {
    const {children, getAuthorizationHeader, ...rest} = options;

    return (
        <FetchContext.Provider
            value={{
                getAuthorizationHeader,
                ...rest,
            }}
        >
            {children}
        </FetchContext.Provider>
    );
}

FetchProvider.defaultProps = {};

export default FetchProvider;
