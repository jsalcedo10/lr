import { createContext } from 'react';

interface ContextProps {
sidemenuOpen: boolean;
isMenuOpen: boolean;
isDark: string;

closeSideMenu: () => void;
openSideMenu: () => void;
toggleSideMenu: () => void;
darkMenu: () => void;
lightMenu: () => void;

}
export const UIContext = createContext({} as ContextProps );