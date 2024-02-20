

import { createContext } from 'react';

interface ContextProps {
    Entity_Id?: number;
    connect : Boolean;

    chaseEntity: (Entity_Id : number) => Promise<boolean>;

    dbConnection: (connect : Boolean) => Promise<boolean>;

}


export const ChaseContext = createContext({} as ContextProps );