import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';
import { IProduct } from '../interfaces/products';


export const useProducts = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<IProduct[]>(`/api${ url }`, config );
    mutate(`/api${ url }`, data, true); 

    return {
        products: data || [],
        isLoadingProduct: !error && !data,
        isError: error
    }
}