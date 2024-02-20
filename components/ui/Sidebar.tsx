import { useContext } from 'react';
import { Box, Divider, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import HomeIcon from '@mui/icons-material/Home';
import { UIContext } from '../../context/ui';
import { useRouter } from 'next/router';

export const Sidebar = () => {

    const router = useRouter();

    const { sidemenuOpen, closeSideMenu } = useContext( UIContext );

    const navigateTo = ( url: string ) => {
        closeSideMenu();
        router.push(url);
    }

    return (
        <Drawer
            anchor='left'
            open={ sidemenuOpen }
            onClose={ closeSideMenu}
            sx={{ transition: 'all 0.5s ease-out' }}
            id="sidebar"
        >
            <Box sx={{ width: 250 }}>

                <Box sx={{ padding:'15px 65px' }}>
                    <Typography variant="h6" >Devise</Typography>
                </Box>


                <Divider />

                <ListItem 
                button 
                onClick={() => navigateTo('/') }
                >
                <ListItemIcon>
                <HomeIcon/>
                </ListItemIcon>
                <ListItemText primary={'Home'} />
                </ListItem>

                <Divider />


                <Divider />

                <ListItem 
                  button 
                  onClick={() => navigateTo('entity') }
                >
                <ListItemIcon>
                <SupervisedUserCircleIcon/>
                </ListItemIcon>
                 <ListItemText primary={'Clients'} />
                </ListItem>

                <Divider />


            </Box>
            
        </Drawer>
    )
};
