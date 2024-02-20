import { FC, useReducer } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ISales } from '../../interfaces/Sales';
import { SalesContext } from './SalesContext';
import {SalesReducer } from './SalesReducer';

export interface SalesState {
    sales?: ISales;
}

export const SalesProvider:FC = ({ children }) => {

    const SALES_INITIAL_STATE: SalesState = {
        sales: undefined
    }

    const [state, dispatch] = useReducer( SalesReducer, SALES_INITIAL_STATE );

    const bulkUser = async(idArray : number[] , Active : boolean, isBulk : boolean, isDelete : boolean): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axios.put(`${'/api/sales/register'}`, {idArray, Active, isBulk, isDelete});

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

    const registerSales = async( UserName: string, Password: string, Position_Id : number, Department_Id: number, 
        IsAdmin : number, IsEmployee : number, Email : string ,Entity_Id : number,IncidenceNotification:number,
        ContractNotification:number, Active : boolean): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axios.post(`${'/api/sales/register'}`, { UserName, Password, Position_Id, Department_Id, IsAdmin,IsEmployee, Email, Entity_Id,
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
    const updateSales = async(Id: number, UserName: string, Password: string, Position_Id : number, Department_Id: number, IsAdmin : number, IsEmployee : number, Email : string ,Entity_Id: number,IncidenceNotification:number,
        ContractNotification:number, Active : boolean): Promise<{hasError: boolean; message?: string}> => {
        try {
            const { data } = await axios.put(`${'/api/sales/register'}`, {Id, UserName, Password, 
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

    const deleteSales = async( Id : number ): Promise<{hasError: boolean; message?: string}> => {

        try {
            const { data } = await axios.delete(`${'/api/sales/register'}` , {
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
        <SalesContext.Provider value={{
            ...state,
            bulkUser,
            registerSales,
            updateSales,
            deleteSales,
        }}>
            { children }
        </SalesContext.Provider>
    )
};