import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';


export const useFlags = (url: string, config: SWRConfiguration = {} ) => {

    const { data, error } = useSWR<any[]>(`https${ url }`, config);
    //mutate(`https://restcountries.com/v3.1/all`, data, false); 

    return {
        flags: data || [],
        isLoadingFlag: !error && !data,
        isError: error
    }
}