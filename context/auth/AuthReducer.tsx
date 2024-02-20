import { AuthState } from '.';
import { IUser } from '../../interfaces';
import Cookies from 'js-cookie';


type AuthActionType = 
   | { type: '[Auth] - Login', payload: IUser } 
   | { type: '[Auth] - Logout' } 


export const AuthReducer = ( state: AuthState, action: AuthActionType): AuthState => {
   switch (action.type) {
       
        case '[Auth] - Login':
            return {
                ...state,
                isLoggedIn: true,
                user: action.payload,
                status : 'authenticated',
                token : Cookies.get('token')
            }
           
            case '[Auth] - Logout':
                return {
                    ...state,
                    isLoggedIn: false,
                    user: undefined,
                    status : 'unauthenticated',
                    token : undefined
                }

       default:
          return state;
   }

}