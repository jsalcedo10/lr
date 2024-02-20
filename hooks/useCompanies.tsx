import useSWR, { SWRConfiguration, mutate } from 'swr';
import { ICompanies } from '../interfaces/companies';
export const useCompanies = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<ICompanies[]>(`/api${ url }`, config);
    mutate(`/api${ url }`, data, true); 

    return {
        companies: data || [],
        isLoadingCompanies: !error && !data,
        isError: error
    }
}