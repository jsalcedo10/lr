import { FC, useReducer } from 'react';
import { UIReducer2 } from './UIReducer2';
import { UIContext } from './UIContext';

export interface UIState {
    sidemenuOpen: boolean;
    isMenuOpen: boolean;
    isDark : string;
}


const UI_INITIAL_STATE: UIState = {
    sidemenuOpen: false,
    isMenuOpen: false,
    isDark : ""
}


export const UIProvider:FC = ({ children }) => {

    const [state, dispatch] = useReducer( UIReducer2, UI_INITIAL_STATE );


    const toggleSideMenu = () => {
        dispatch({ type: '[UI] - ToggleMenu' });
    }


    const openSideMenu = () => {
        dispatch({ type: 'UI - Open Sidebar' });
    }

    const closeSideMenu = () => {
        dispatch({ type: 'UI - Close Sidebar' })
    }

    const darkMenu = () => {
        dispatch({ type: 'UI - darktheme' });
    }

    const lightMenu = () => {
        dispatch({ type: 'UI - lighttheme' });
    }


    return (
        <UIContext.Provider value={{
            ...state,

            // Methods
            closeSideMenu,
            openSideMenu,         
            toggleSideMenu,
            darkMenu,
            lightMenu

        }}>
            { children }
        </UIContext.Provider>
    )
};