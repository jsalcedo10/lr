import useSWR, { SWRConfiguration, mutate } from 'swr';
import { IOrderTypes } from '../interfaces/ordertypes';
export const useOrderTypes = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<IOrderTypes[]>(`/api${ url }`, config);
    mutate(`/api${ url }`, data, true); 

    return {
        orderTypes: data || [],
        isLoadingOrderTypes: !error && !data,
        isError: error
    }
}