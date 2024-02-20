import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';


export const useCountry = (url: string, config: SWRConfiguration = {} ) => {

    const { data, error } = useSWR<any[]>(`https://countriesnow.space/api/v0.1${url}`, config );
    //mutate(`/api${ url }`, data, false); 

    return {
        cont: data || [],
        isLoadingCountry: !error && !data,
        isError: error
    }
}