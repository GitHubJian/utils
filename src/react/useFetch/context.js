import {createContext} from 'react';

export const FetchContext = createContext({});

export function useFetchContext() {
    const context = useContext(FetchContext);

    return context;
}
