import { CHASEState } from "./ChaseProvider";

      
type CHASEActionType = 
| { type: 'CHASE - entity change', payload: number } 
| { type: 'CHASE - db connection', payload: Boolean } 

export const ChaseReducer = ( state: CHASEState, action: CHASEActionType ): CHASEState => {

   switch (action.type) {
      case 'CHASE - entity change':
         return {
            ...state,
            Entity_Id: action.payload,
          }

      case 'CHASE - db connection':
         return {
            ...state,
            connect: action.payload,
          }


       default:
          return state;
   }

}