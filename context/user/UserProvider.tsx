import { FC, useReducer } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IUser } from '../../interfaces';
import { UserContext } from './UserContext';
import { UserReducer } from './UserReducer';

export interface UserState {
    user?: IUser;
}

export const UserProvider:FC = ({ children }) => {

    const USER_INITIAL_STATE: UserState = {
        user: undefined
    }

    const [state, dispatch] = useReducer( UserReducer, USER_INITIAL_STATE );

    const bulkUser = async(idArray : number[] , Active : boolean, isBulk : boolean, isDelete : boolean): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axios.put(`${'/api/user/register'}`, {idArray, Active, isBulk, isDelete});

            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'User cannot update - try again'
            }
        }
    }

    const registerUser = async( UserName: string, Password: string, Position_Id : number, Department_Id: number, 
        IsAdmin : number, IsEmployee : number, Email : string ,Entity_Id : number,IncidenceNotification:number,
        ContractNotification:number, Active : boolean): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axios.post(`${'/api/user/register'}`, { UserName, Password, Position_Id, Department_Id, IsAdmin,IsEmployee, Email, Entity_Id,
                IncidenceNotification,ContractNotification, Active });
            //const { token, user } = data;
            //Cookies.set('token', token );
            //dispatch({ type: '[User] - Register', payload: user });
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: 'Error with the user or user exist- Try again'
                }
            }

            return {
                hasError: true,
                message: 'Error with the user or user exist- Try again'
            }
        }
    }
    const updateUser = async(Id: number, UserName: string, Password: string, Position_Id : number, Department_Id: number, IsAdmin : number, IsEmployee : number, Email : string ,Entity_Id: number,IncidenceNotification:number,
        ContractNotification:number, Active : boolean): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axios.put(`${'/api/user/register'}`, {Id, UserName, Password, 
                Position_Id, Department_Id, IsAdmin,IsEmployee, Email, Entity_Id,IncidenceNotification,
                ContractNotification, Active});
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'User cannot update or user exist- Try again'
            }
        }
    }

    const deleteUser = async( Id : number ): Promise<{hasError: boolean; message?: string}> => {

        try {
            const { data } = await axios.delete(`${'/api/user/register'}` , {
                data: {Id : Id}});
            return {
                hasError: false
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'User cannot delete - try again'
            }
        }
    }
    

    return (
        <UserContext.Provider value={{
            ...state,
            bulkUser,
            registerUser,
            updateUser,
            deleteUser,
        }}>
            { children }
        </UserContext.Provider>
    )
};