

import { createContext } from 'react';
import { IUser } from '../../interfaces';


interface ContextProps {
    isLoggedIn: boolean;
    user?: IUser;
    entity_Id?: any;
    logged? :boolean;
    token?:string;
    color? : string;

    loginUser: (Email: string, Password: string) => Promise<{hasError: boolean; message?: any[];}>;
    registerUser: (UserName: string, Password: string, Email : string, Active : Boolean,  IsAdmin : number,IsEmployee : number, Department_Id: number,Entity_Id : number, Position_Id: number) => Promise<{ hasError: boolean; message?: string; }>;
    logout: () => void;
}


export const AuthContext = createContext({} as ContextProps );