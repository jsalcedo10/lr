import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';
import { ISales } from '../interfaces/Sales';


export const useSales = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<ISales[]>(`/api${ url }`, config );
    mutate(`/api${ url }`, data, true); 

    return {
        sales: data || [],
        isLoadingSales: !error && !data,
        isError: error
    }
}