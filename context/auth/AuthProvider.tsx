import { FC, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { AuthContext, AuthReducer } from './';
import { IUser } from '../../interfaces';
import { useValidateToken } from '../../hooks/useValidateToken';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser;
    entity_Id?: any;
    status?: string;
    token?: string;
    color?: string;

}


const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
    entity_Id: undefined,
    status: undefined,
    token: '',
    color: ''

}

export const AuthProvider: FC = ({ children }) => {

    const [state, dispatch] = useReducer(AuthReducer, AUTH_INITIAL_STATE);
    const { data, status } = useSession();
    const router = useRouter();
    useEffect(() => {
        if (status === 'authenticated') {
            dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
        }
    }, [status, data])

    useEffect(() => {
        checkToken();
    }, [])

    const checkToken = async () => {

        if (!Cookies.get('token')) {
            return;
        }

        try {
            const { data } = await axios.get('/api/user/validate-token');
            const { token, user } = data;
            Cookies.set('token', token);

            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            Cookies.remove('token');
        }
    }


    const loginUser = async (Email: string, Password: string): Promise<{ hasError: boolean; message?: any[] }> => {
        try {
            const { data } = await axios.post(`${'/api/user/login'}`, { Email, Password });
            const { token, user } = data;
            //console.log(data)
            Cookies.set('token', token);
            Cookies.set('Email', Email);
            Cookies.set('Lang', router.locale!);
            const hex = Math.floor(Math.random() * 0xFFFFFF);
            const color = "#" + hex.toString(16);
            Cookies.set('color', color);
            dispatch({ type: '[Auth] - Login', payload: user });
            return { hasError: false }
        }
        catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: ['No se pudo crear el usuario - intente de nuevo']
            }
        }

    }


    const registerUser = async (UserName: string, Password: string, Email: string, Active: Boolean, IsAdmin: number,IsEmployee: number, Department_Id: number, Entity_Id: number, Position_Id: number): Promise<{ hasError: boolean; message?: string }> => {
        try {
            const { data } = await axios.post(`${'/api/user/register'}`, { UserName, Password, Email, Active, IsAdmin,IsEmployee, Department_Id, Entity_Id, Position_Id });
            //const { token, user } = data;
            //Cookies.set('token', token );
            //dispatch({ type: '[Auth] - Login', payload: user});
            return {
                hasError: false
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - intente de nuevo'
            }
        }
    }

    const logout = async () => {
        Cookies.remove('token');
        Cookies.remove('Password');
        Cookies.remove('UserName');
        Cookies.remove('Lang');
        router.push('/auth/login?p=/')
        router.reload();
        dispatch({ type: '[Auth] - Logout' });
        //router.push('/auth/login?p=/')
        //signOut();

    }

    return (
        <AuthContext.Provider value={{
            ...state,
            loginUser,
            registerUser,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
};