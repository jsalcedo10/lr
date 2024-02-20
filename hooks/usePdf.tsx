import useSWR, { SWRConfiguration } from 'swr';
import { mutate } from 'swr';


export const usePdf = (url: string, config: SWRConfiguration = {} ) => {

    const { data, error } = useSWR<Blob[]>(`/api${ url }`, config );
    //mutate(`/api${ url }`, data, false); 

    return {
        pdf: data || [],
        isLoadingpdf: !error && !data,
        isError: error
    }
}