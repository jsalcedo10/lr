import { ISales } from '../../interfaces/Sales';
import { SalesState } from './SalesProvider';


type UserActionType = 
   | { type: '[Sales] - Register', payload: ISales } 
   | { type: '[Sales] - Update', payload: ISales } 
   | { type: '[Sales] - Delete', payload: ISales } 


export const SalesReducer = ( state: SalesState, action: UserActionType ): SalesState => {

   switch (action.type) {
        case '[Sales] - Register':
            return {
                ...state,
                sales: action.payload
            }       
        
        case '[Sales] - Update':
              return {
                 ...state,
                 sales: action.payload
              }
        case '[Sales] - Delete':
               return {
                    ...state,
                    sales: action.payload
            }

       default:
          return state;
   }

}