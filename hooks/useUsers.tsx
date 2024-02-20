import useSWR, { SWRConfiguration, mutate } from 'swr';
import { IUser } from '../interfaces';
export const useUsers = (url: string, config: SWRConfiguration = {} ) => {
    const { data, error } = useSWR<IUser[]>(`/api${ url }`, config);
    mutate(`/api${ url }`, data, true); 

    return {
        user: data || [],
        isLoadingUser: !error && !data,
        isError: error
    }
}