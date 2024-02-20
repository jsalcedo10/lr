import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';
import { ICurrencies } from '../interfaces/currencies';

export const useCurrency = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<ICurrencies[]>(`/api${ url }`, config);
    //mutate(`/api${ url }`, data, false); 

    return {
        currencies: data || [],
        isLoadingCurrency: !error && !data,
        isError: error
    }
}