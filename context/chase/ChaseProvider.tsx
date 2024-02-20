import { FC, useReducer, useContext } from 'react';
import { AuthContext } from '../auth';
import { ChaseContext } from './ChaseContext';
import { ChaseReducer } from './ChaseReducer';

export interface CHASEState {
    Entity_Id: number;
    connect: Boolean;

}

const CHASE_INITIAL_STATE: CHASEState = {
    Entity_Id: 0,
    connect: false,
}

export const CHASEProvider:FC = ({ children }) => {

    const [state, dispatch] = useReducer( ChaseReducer, CHASE_INITIAL_STATE );
    const { user } = useContext(AuthContext);


    const chaseEntity = async( Entity_Id: number):  Promise<boolean> => {
        try {

            dispatch({ type: 'CHASE - entity change', payload: user?.IsAdmin! == 1 ? Entity_Id : (user?.Entity_Id == undefined ? 0 : user?.Entity_Id)});
            return true;

        } catch (error) {

            return false;
        }

    }

    const dbConnection = async( connect: Boolean):  Promise<boolean> => {
        try {

            dispatch({ type: 'CHASE - db connection', payload: connect});
            return true;

        } catch (error) {

            return false;
        }

    }


    return (
        <ChaseContext.Provider value={{
            ...state,
            
            chaseEntity,
            dbConnection

        }}>
            { children }
        </ChaseContext.Provider>
    )
};