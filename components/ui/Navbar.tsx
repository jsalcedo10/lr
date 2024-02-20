import { useContext } from 'react';
import { AppBar, IconButton,  Typography, Toolbar, Box } from '@mui/material';
import { UIContext } from '../../context/ui';
import {AccountCircle, Brightness7  } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { Link } from '@nextui-org/react';
import { useTheme as useNextTheme } from 'next-themes'
import { Switch, useTheme, Spacer , Text,Image} from '@nextui-org/react'
import NextLink from 'next/link';
// import Image from 'next/image';

export const Navbar = () => {
  const { openSideMenu } = useContext( UIContext );
  const { toggleSideMenu } = useContext( UIContext );
  const { setTheme } = useNextTheme();
  const { isDark, type } = useTheme();

  return (
      <AppBar position='static'  sx={{ flex: 1 }} >
          <Toolbar >
           <IconButton 
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={ openSideMenu }
              >
              <MenuIcon />
          </IconButton>
          <NextLink href="/" passHref>
                <Link>
                    <Text color='white' h2>C</Text>
                    <Text color='white' h3 css={{ padding: '0px 0px 0px 2px'  }}>YD</Text>
                </Link>
            </NextLink>
            <Image 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Chess_%28game%29_pictogram.svg/480px-Chess_%28game%29_pictogram.svg.png?20180906124612"
                width={70}
                height={70}
                style={{ padding: '0px 0px 0px 3px'  }}
            />

                <Spacer css={{ flex: 1 }}/>
              <Brightness7  />

                <Switch
                  checked={isDark}
                  onChange={(e) => setTheme(e.target.checked ? 'dark' : 'light')}
                />

             <DarkModeIcon  />

            <IconButton 
               size='large'
               edge="end"
               onClick={ toggleSideMenu }
            >
             <AccountCircle  />
            </IconButton>
          </Toolbar>
      </AppBar>
  );
}
