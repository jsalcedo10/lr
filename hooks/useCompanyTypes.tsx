import useSWR, { SWRConfiguration, mutate } from 'swr';
import { ICompanyTypes } from '../interfaces/companytypes';
export const useCompanyTypes = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<ICompanyTypes[]>(`/api${ url }`, config);
    mutate(`/api${ url }`, data, true); 

    return {
        companyTypes: data || [],
        isLoadingCompanyTypes: !error && !data,
        isError: error
    }
}