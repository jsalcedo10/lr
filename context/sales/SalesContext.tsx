
import { createContext } from 'react';
import { ISales } from '../../interfaces/Sales';


interface ContextProps {
    sales?: ISales;

    bulkUser : (idArray: number[], Active : boolean, isBulk : boolean, isDelete : boolean) => Promise<{ hasError: boolean; message?: string; }>;

    registerSales: (UserName : string, Password : string, Position_Id : number, Department_Id : number, 
        IsAdmin : number, IsEmployee : number, Email : string, Entity_Id : number,IncidenceNotification:number,
        ContractNotification:number, Active : boolean) => Promise<{ hasError: boolean; message?: string; }>;
   
    updateSales: (Id: number,UserName : string, Password : string, Position_Id : number, Department_Id : number, IsAdmin : number,IsEmployee: number, Email : string, Entity_Id : number,IncidenceNotification:number,ContractNotification:number, Active : boolean) => Promise<{ hasError: boolean; message?: string; }>;

    deleteSales: (Id : number) => Promise<{ hasError: boolean; message?: string; }>;
    }


export const SalesContext = createContext({} as ContextProps );