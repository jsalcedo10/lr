import { IUser } from '../../interfaces/user';
import { UserState } from './UserProvider';


type UserActionType = 
   | { type: '[User] - Register', payload: IUser } 
   | { type: '[User] - Update', payload: IUser } 
   | { type: '[User] - Delete', payload: IUser } 


export const UserReducer = ( state: UserState, action: UserActionType ): UserState => {

   switch (action.type) {
        case '[User] - Register':
            return {
                ...state,
                user: action.payload
            }       
        
        case '[User] - Update':
              return {
                 ...state,
                 user: action.payload
              }
        case '[User] - Delete':
               return {
                    ...state,
                    user: action.payload
            }

       default:
          return state;
   }

}