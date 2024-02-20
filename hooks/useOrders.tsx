import useSWR, { SWRConfiguration, mutate } from 'swr';
import { IOrders } from '../interfaces/orders';
export const useOrders = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<IOrders[]>(`/api${ url }`, config);
    mutate(`/api${ url }`, data, true); 

    return {
        orders: data || [],
        isLoadingOrders: !error && !data,
        isError: error
    }
}