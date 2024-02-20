import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';


export const useValidateToken = (url: string, config: SWRConfiguration = {} ) => {

    const { data, error } = useSWR(`/api${ url }`, config );
    //mutate(`/api${ url }`, data, false); 

    return {
        data: data || [],
        isLoading: !error && !data,
        isError: error
    }
}