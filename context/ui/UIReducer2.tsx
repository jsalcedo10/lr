import { UIState } from "."

      
type UIActionType = 
    | { type: 'UI - Open Sidebar' } 
    | { type: 'UI - Close Sidebar' }
    | { type: '[UI] - ToggleMenu' } 
    | { type: 'UI - darktheme' }
    | { type: 'UI - lighttheme' }
   
export const UIReducer2 = ( state: UIState, action: UIActionType ): UIState => {

   switch (action.type) {
      case 'UI - Open Sidebar':
         return {
            ...state,
            sidemenuOpen: true,
          }

      case 'UI - Close Sidebar':
          return {
            ...state,
            sidemenuOpen: false,
           }

       case '[UI] - ToggleMenu':
           return {
            ...state,
            isMenuOpen: !state.isMenuOpen
          }

      case 'UI - darktheme':
           return {
            ...state,
            isDark: "darkTheme",
          }

      case 'UI - lighttheme':
           return {
            ...state,
            isDark: "lighttheme"
          }

       default:
          return state;
   }

}