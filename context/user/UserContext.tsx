
import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {
    user?: IUser;

    bulkUser : (idArray: number[], Active : boolean, isBulk : boolean, isDelete : boolean) => Promise<{ hasError: boolean; message?: string; }>;

    registerUser: (UserName : string, Password : string, Position_Id : number, Department_Id : number, 
        IsAdmin : number, IsEmployee : number, Email : string, Entity_Id : number,IncidenceNotification:number,
        ContractNotification:number, Active : boolean) => Promise<{ hasError: boolean; message?: string; }>;
   
    updateUser: (Id: number,UserName : string, Password : string, Position_Id : number, Department_Id : number, IsAdmin : number,IsEmployee: number, Email : string, Entity_Id : number,IncidenceNotification:number,ContractNotification:number, Active : boolean) => Promise<{ hasError: boolean; message?: string; }>;

    deleteUser: (Id : number) => Promise<{ hasError: boolean; message?: string; }>;
    }


export const UserContext = createContext({} as ContextProps );