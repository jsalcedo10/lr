import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';


export const useNationalities = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<any[]>(`/api${ url }`, config);
    //mutate(`/api${ url }`, data, false); 

    return {
        nationalities: data || [],
        isLoadingNationalities: !error && !data,
        isError: error
    }
}