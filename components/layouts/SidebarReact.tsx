import * as React from 'react';
import { styled, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import DrawerResponsive from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItemIcon from '@mui/material/ListItemIcon';
import { Text, Spacer, Switch, Image, Card, Row } from '@nextui-org/react';
import { FC, useState, useContext, useEffect, ChangeEvent } from 'react';
import NextLink from 'next/link';
import { Link, Grid, ListItem, ListItemText, Menu, MenuItem, TextField, FormControl, Button, Stack, Avatar, StepLabel, FormControlLabel, Collapse, ListItemButton, NativeSelect, CardContent, MenuProps, alpha, List, Paper, Badge, Tooltip } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import BadgeIcon from '@mui/icons-material/Badge';
import { AccountCircle, LoginOutlined, AccountCircleOutlined, DashboardOutlined, ExpandLess, ExpandMore, Logout, Dashboard, FormatListBulleted, HistoryEdu, Settings, Inventory2, Store, Storefront, PeopleAlt, Groups, LocalShipping, Loyalty, CurrencyExchange, Category, QueryStats, Assessment, HolidayVillage } from '@mui/icons-material';
import { UIContext } from '../../context/ui/UIContext';
import { useTheme } from '@mui/material';
import { AuthContext } from '../../context/auth';
import Cookies from 'js-cookie';

import { GetServerSideProps } from 'next';
import { jwt } from '../../utils';
import { useRouter } from 'next/router';
import { Col, Table } from 'react-bootstrap';
import PaymentIcon from '@mui/icons-material/Payment';
import { IUser } from '../../interfaces/user';
import Slide from '@mui/material/Slide';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import InputBase from '@mui/material/InputBase';
import BusinessIcon from '@mui/icons-material/Business';
import { makeStyles } from "@material-ui/core/styles";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

interface Props {
  token: boolean;
  userr: IUser[];
  window?: () => Window;
  children: React.ReactElement;
  props: Props;
}

const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

function HideOnScroll(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  const [triger, settriger] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      settriger(true);
    }, 100);
  }, []);

  return (
    <Slide appear={false} direction="down" in={triger == false ? false : !trigger}>
      {children}
    </Slide>
  );
}

function HideOnScrollFooter(props: Props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  const [triger, settriger] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      settriger(true);
    }, 100);
  }, []);

  return (
    <Slide appear={false} direction="up" in={triger == false ? false : !trigger}>
      {children}
    </Slide>
  );
}



export const PersistentDrawerLeft: FC<Props> = ({ children, props: Props }) => {

  const { user: userModel, isLoggedIn, logged, color, token } = useContext(AuthContext);

  const router = useRouter();

  useEffect(() => {
    const path = router.pathname.split('/')[1]

    if (path == '') {
      setSelectedIndex(1);
    }
    else if (path == 'sales') {
      setSelectedIndex(2);
    }
    else if (path == 'products') {
      setSelectedIndex(3);
    }
    else if (path == 'companies') {
      setSelectedIndex(4);
    }
    else if (path == 'ordertypes') {
      setSelectedIndex(5);
    }
    else if (path == 'companytypes') {
      setSelectedIndex(6);
    }
    else if (path == 'currencies') {
      setSelectedIndex(7);
    }
    else if (path == 'user') {
      setSelectedIndex(8);
    }
    else if (path == 'reports') {
      const report = router.asPath.split('/')[2]
      if (report == 'cre') {
        setSelectedIndex(9);
      }
    }
  })



  const label = 'LR Capital Desarrollado por '
  const label2 = ' S.A de C.V'

  const BootstrapInput = styled(InputBase)(({ theme }) => ({

    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 6,
      position: 'relative',
      border: '10px #DFFCFA ',
      fontSize: 19,
      display: 'inline-block',
      lineHeight: '1',
      fontWeight: 'bold',
      color: '#FFF',
      padding: '0.16666666666667em 0.5em',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        'sans-serif',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        border: '10px #DFFCFA ',
        borderColor: '#FFFFFF',
        boxShadow: '0 0 0 0.1rem #FFF',
      },
    },
  }));

  const BootstrapInputLeng = styled(InputBase)(({ theme }) => ({

    'label + &': {
      marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
      borderRadius: 6,
      position: 'relative',
      border: '10px #DFFCFA ',
      fontSize: 15,
      fontWeight: 'bold',
      color: '#FFF',
      padding: '5px 21px 5px 7px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        'sans-serif',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        border: '10px #DFFCFA ',
        borderColor: '#FFF',
        boxShadow: '0 0 0 0.1rem #FFF',
      },
    },
  }));

  const useStyles = makeStyles({
    icon: {
      fill: '#FFF'
    }
  });

  const classes = useStyles();

  const [auth, setAuth] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElNoti, setAnchorElNoti] = useState<null | HTMLElement>(null);
  const [widthCombo, setWidth] = useState('100%');
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);

  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseNoti = async () => {
    setAnchorElNoti(null);
    //const User_Id = userModel?.Id;
    //await axios.put(`${'/api/notification'}`, {User_Id});
  };

  const theme = useTheme();

  const [open, setOpen] = useState(true);

  const { toggleSideMenu } = useContext(UIContext);
  const { logout } = useContext(AuthContext);

  const handleDrawerOpen = () => {
    setOpen(true);
    setWidth('100%')
  };

  const handleDrawerClose = () => {
    setOpen(!open);
    setWidth(open == true ? '100%' : '100%')
  };

  function getWindowDimensions() {
    if (typeof window !== "undefined") {
      const { innerWidth: width, innerHeight: height } = window;
      return {
        width,
        height
      };
    }
    return { width: 0, height: 0 }

  }
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });
  type Anchor = 'top' | 'left' | 'bottom' | 'right';

  function logOut() {
    setSelectedIndex(1);
    toggleSideMenu();
    handleClose();
    handleCloseNoti();
    logout();
  }

  const language = [
    {
      lan: 'es',
      welcome: 'Bienvenido',
      adminSettings: "Configuración",
      logOut: 'Cerrar Sesión',
      home: 'Principal',
      sales: 'Control de ventas',
      products: 'Productos',
      companies: 'Empresas',
      ordertypes: 'Tipo de Orden',
      companytypes: 'Tipo de Empresa',
      currencies: 'Tipo de Moneda',
      users: "Usuarios",
      reports: "Reportes"

    },
    {
      lan: 'en',
      welcome: 'Bienvenido',
      adminSettings: "Configuración",
      logOut: 'Cerrar Sesión',
      home: 'Principal',
      sales: 'Control de ventas',
      products: 'Productos',
      companies: 'Empresas',
      ordertypes: 'Tipo de Orden',
      companytypes: 'Tipo de Empresa',
      currencies: 'Tipo de Moneda',
      users: "Usuarios",
      reports: "Reportes"

    }
  ];

  const navigateTo = (url: string) => {
    router.push(url);
  }

  const [selectedIndex, setSelectedIndex] = useState(1);

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
  };
  const [heightAvatar, setHeightAvatar] = useState([34, 34]);
  const themeC = createTheme();

  themeC.typography.h3 = {
    fontSize: '1rem',
    '@media (min-width:400px)': {
      fontSize: '.6rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  };

  const themeE = createTheme();

  themeE.typography.h3 = {
    fontSize: '25px',
    '@media (min-width:400px)': {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '25px',
    },
  };


  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      width: state.selectProps.width,
      borderBottom: '1px dotted pink',
      color: state.selectProps.menuColor,
      padding: 20,
    }),

    control: (_, { selectProps: { width } }) => ({
      width: width
    }),

    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';

      return { ...provided, opacity, transition };
    }
  }


  const [anchorEl33, setAnchorEl33] = React.useState<null | HTMLElement>(null);


  const StyledMenu = styled((props: MenuProps) => (
    <Menu
      PaperProps={{
        elevation: 0,
        sx: {
          boxShadow: 'rgba(230, 242, 242) 0px 3px 12px 1px',
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
          border: '1px solid rgb(240,242,242)',

          mt: 1.5,
          '& .MuiAvatar-root': {
            width: 30,
            boxShadow: 'rgba(230, 242, 242) 0px 3px 12px 1px',
            border: '1px solid rgb(240,242,242)',
            height: 30,
            ml: -0.5,
            mr: 1,
          },
          '&:before': {
            content: '""',
            display: 'block',
            boxShadow: 'rgba(230, 242, 242) 0px 3px 12px 1px',
            position: 'absolute',
            border: '1px solid rgb(240,242,242)',
            top: 0,
            right: 25,
            width: 10,
            height: 10,
            bgcolor: 'background.paper',
            transform: 'translateY(-50%) rotate(45deg)',
            zIndex: 0,
          },
        },
      }}
      elevation={0}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      {...props}
    />
  ))(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 6,
      marginTop: theme.spacing(1),
      minWidth: 180,
      color:
        theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
      boxShadow:
        'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
      '& .MuiMenu-list': {
        padding: '4px 0',
      },
      '& .MuiMenuItem-root': {
        '& .MuiSvgIcon-root': {
          fontSize: 18,
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        '&:active': {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity,
          ),
        },
      },
    },
  }));

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === 'keydown' &&
          ((event as React.KeyboardEvent).key === 'Tab' ||
            (event as React.KeyboardEvent).key === 'Shift')
        ) {
          return;
        }

      };

  const [openExpandAdminSettings, setOpenExpandAdminSettings] = useState(false);
  const [openExpandReports, setOpenExpandReports] = useState(false);

  const handleExpandAdminSettings = () => {
    setOpenExpandReports(false)
    setOpenExpandAdminSettings(!openExpandAdminSettings);
  };

  const handleExpandReports = () => {
    setOpenExpandAdminSettings(false)
    setOpenExpandReports(!openExpandReports);
  };

  const NavBar = (isResponsive: boolean) => {

    return (
      <HideOnScroll {...Props}>
        <AppBar position="fixed" open={open} id="Toolbar" sx={{ flex: 1 }} style={{ backgroundColor: isResponsive && open == true ? 'rgba(127, 127, 127)' : '' }}>
          <Toolbar >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Row style={{ width: '50%' }}>
              {
                !open && (
                  <>
                    <Col >
                      <Image
                        src="/img/lrcp-logo.png"
                        width={64}
                        height={64}
                        css={{ padding: '0px 0px 0px 3px' }}
                      />
                    </Col>
                    <Spacer></Spacer>
                  </>
                )

              }


            </Row>

            <Spacer css={{ flex: 1 }} />
            <Box style={{ display: 'flex', justifyContent: 'end', alignItems: 'flex-end', alignContent: 'flex-end', flexDirection: 'row' }}>
              <ThemeProvider theme={themeC} >
                <Typography style={{ letterSpacing: '.01px', paddingTop: 10, fontWeight: 600, fontFamily: 'M PLUS 2' }} variant="h3">{language.filter((f: any) => f.lan == 'es')?.map(f => f.welcome)} {userModel?.Name}</Typography>
              </ThemeProvider>
            </Box>

            {auth && (
              <Box sx={{ width: 40, height: 50, display: 'flex', justifyContent: 'center', alignContent: 'center', textAlign: 'center' }}>
                {
                  /*
              <IconButton
                size="medium"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenuNotifications}
                color="inherit"
                title='Notifications'
              >

                  notisActive > 0
                   ?
                   <Badge badgeContent={notisActive} color="error">
                     <NotificationsActiveIcon sx={{fontSize : '18px', width: 34, height: 34, color : 'white'}}/>
                  </Badge>

                   :

                   <Badge  color="error">
                    <NotificationsIcon sx={{fontSize : '18px', width: 34, height: 34, color : '#515151'}}/>
                  </Badge>
                  

              </IconButton>
              &nbsp;*/
                }
                <IconButton
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? 'account-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleMenu}
                  style={{ paddingTop: 12 }}
                >
                  <Avatar sx={{ fontSize: '18px', width: heightAvatar[0], height: heightAvatar[1], bgcolor: Cookies.get('color') }}>{userModel?.Name?.substring(0, 1).toUpperCase()}</Avatar>
                </IconButton>

                <Menu
                  TransitionProps={{ timeout: 0 }}
                  id="menu-appbar"
                  style={{ width: '100%' }}
                  anchorEl={anchorElNoti}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNoti)}
                  onClose={handleCloseNoti}
                >
                  {
                    /*
                  <ListItem button>
                  <EmailIcon />
                  &nbsp;
                    <ListItemIcon style ={{ textAlign : 'left'}}>
                      <ListItemText primary={`You have ${notisActive} notifications`} style ={{ color : 'black', textAlign : 'left'}}/>
                    </ListItemIcon>
                  </ListItem>
                    */
                  }

                </Menu>

                <Menu
                  TransitionProps={{ timeout: 0 }}
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  style={{ boxShadow: 'rgba(230, 242, 242) 0px 3px 12px 1px' }}
                  disableScrollLock={true}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      minWidth: '10vh',
                      backgroundColor: '#FFF',
                      borderRadius: '12px',
                      transition: 'none !important',
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 0px 1px rgba(0,0,0,0.18))',
                      mt: .5,
                      '& .MuiAvatar-root': {
                        width: '100%',
                        height: '100%',
                        ml: -0.5,
                        mr: 1,
                      },

                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <Box sx={{ width: '100%', height: '100%', alignItems: 'left', textAlign: 'left' }}>
                    <MenuItem onClick={logOut} sx={{ margin: .7, borderRadius: '7px' }}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      <Typography id='Typography' sx={{ fontFamily: 'M PLUS 2', fontSize: '16px', letterSpacing: '.5px' }}> {language.filter((f: any) => f.lan == 'es')?.map(f => f.logOut)}</Typography>
                    </MenuItem>
                  </Box>
                </Menu>
              </Box>

            )}

          </Toolbar>
        </AppBar>
      </HideOnScroll>
    )
  }
  const dot = (color = '#FFFFFF') => ({
    alignItems: 'center',
    display: 'flex',

    ':before': {
      backgroundColor: color,
      borderRadius: 15,
      content: '" "',
      display: 'block',
      marginRight: 8,
      height: 10,
      width: 10,
      color: '#FFFFFF'
    },
  });


  return (

    <Grid style={{ width: "100%" }} >
      <>
        {

          Cookies.get('token') === token && isLoggedIn && userModel != undefined

            ?

            <Grid>
              <Box sx={{ display: 'flex' }} >

                {
                  windowDimensions.width! < 1000
                    ?
                    <div>
                      {NavBar(true)}
                      <DrawerResponsive
                        anchor='left'
                        open={open}
                        onClose={handleDrawerClose}
                        sx={{ transition: 'all 0.5s ease-out' }}
                      >

                        <Box style={{ width: 260, height: '100%' }} id="Sidebar">
                          <DrawerHeader style={{ backgroundColor: '#0C0C0C' }}>
                            <Box sx={{ justifyContent: 'center', width: '100%', height: '50px' }}>
                              {
                                open && (
                                  <>
                                    <Image
                                      src="/img/lrcp-logo.png"
                                      width={'110px'}
                                      height={'110px'}
                                      css={{ paddingBottom: 45, paddingLeft: 35 }}
                                    />
                                  </>
                                )
                              }

                            </Box>
                            {
                              open && (
                                <IconButton onClick={handleDrawerClose} style={{ paddingTop: 25, justifyContent: 'center' }}>
                                  {theme.direction === 'ltr' ? <ChevronLeftIcon htmlColor="#FFF" /> : <ChevronRightIcon />}
                                </IconButton>
                              )
                            }


                          </DrawerHeader>



                          <Spacer css={{ flex: 1 }} />
                          <Divider />

                          <NextLink href={`${'/'}`} passHref >
                            <ListItemButton sx={{ marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='1' selected={selectedIndex === 1} onClick={(event) => { handleListItemClick(event, 1), handleDrawerClose() }}
                              style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 1 ? '#262626 ' : '', borderRadius: '7px' }}
                              className="nextLink"
                            >
                              <Link title={language.filter((f: any) => f.lan == 'es')?.map(f => f.home)[0]} >
                                <ListItemIcon >
                                  <HomeIcon htmlColor="#FFF" fontSize='small' />
                                  <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.home)}</Text>
                                </ListItemIcon>
                              </Link>
                            </ListItemButton>
                          </NextLink>

                          <Divider />
                          <NextLink href={`${'/orders/list'}`} passHref >
                            <ListItemButton sx={{ marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} selected={selectedIndex === 2} id='2' onClick={(event) => { handleListItemClick(event, 2), handleDrawerClose() }} style={{ width: '99%', backgroundColor: selectedIndex == 2 ? '#262626 ' : '', borderRadius: '7px' }}
                              className='nextLink'
                            >
                              <Link title={language.filter((f: any) => f.lan == 'es')?.map(f => f.sales)[0]} >
                                <ListItemIcon >
                                  <BadgeIcon htmlColor="#FFF" fontSize='small' />
                                  <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.sales)}</Text>
                                </ListItemIcon>
                              </Link>
                            </ListItemButton>
                          </NextLink>
                          <Divider />
                          <ListItemButton
                            title={language.filter((f: any) => f.lan == 'es')?.map(f => f.reports)[0]}
                            onClick={handleExpandReports} className="nextLink" style={{ width: '99%', borderRadius: '10px' }} sx={{ marginBottom: .5, color: '#FFF', ":hover": { backgroundColor: '#222840', borderRadius: '10px' } }}>
                            <ListItemIcon >
                              <QueryStats htmlColor="#FFF" />
                              <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.reports)}</Text>
                            </ListItemIcon>
                            <Spacer css={{ flex: 1 }} />
                            {openExpandReports ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                          <Divider />
                          <Collapse in={openExpandReports} timeout="auto" unmountOnExit sx={{ color: '#FFF' }} >
                            <NextLink href={`${'/reports/cre'}`} passHref >
                              <ListItemButton
                                title={'Reporte CRE'}
                                sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='9' selected={selectedIndex === 9} onClick={(event) => {handleListItemClick(event, 9), handleDrawerClose() }}
                                style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 9 ? '#262626 ' : '', borderRadius: '7px' }}
                                className="nextLink"
                              >
                                <ListItemIcon >
                                  <Assessment htmlColor="#FFF" />
                                  <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{'Reporte CRE'}</Text>
                                </ListItemIcon>
                              </ListItemButton>
                            </NextLink>
                            <Divider />
                          </Collapse>
                          {userModel.IsAdmin == 1 && (<><ListItemButton
                            title={language.filter((f: any) => f.lan == 'es')?.map(f => f.adminSettings)[0]}
                            onClick={handleExpandAdminSettings} className="nextLink" style={{ width: '99%', borderRadius: '10px' }} sx={{ marginBottom: .5, color: '#FFF', ":hover": { backgroundColor: '#222840', borderRadius: '10px' } }}>
                            <ListItemIcon >
                              <Settings htmlColor="#FFF" />
                              <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.adminSettings)}</Text>
                            </ListItemIcon>
                            <Spacer css={{ flex: 1 }} />
                            {openExpandAdminSettings ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                            <Divider />
                            <Collapse in={openExpandAdminSettings} timeout="auto" unmountOnExit sx={{ color: '#FFF' }} >
                              <NextLink href={`${'/products/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.products)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='3' selected={selectedIndex === 3} onClick={(event) => {handleListItemClick(event, 3), handleDrawerClose() }}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 3 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <Category htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.products)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <NextLink href={`${'/companies/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.companies)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='4' selected={selectedIndex === 4} onClick={(event) => { handleListItemClick(event, 4), handleDrawerClose() }}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 4 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <HolidayVillage htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.companies)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/ordertypes/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.ordertypes)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='5' selected={selectedIndex === 5} onClick={(event) => { handleListItemClick(event, 5), handleDrawerClose() }}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 5 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <Loyalty htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.ordertypes)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/companytypes/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.companytypes)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='6' selected={selectedIndex === 8} onClick={(event) => { handleListItemClick(event, 6), handleDrawerClose() }}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 6 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <BusinessIcon htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.companytypes)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/currencies/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.currencies)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='7' selected={selectedIndex === 7} onClick={(event) => { handleListItemClick(event, 7), handleDrawerClose() }}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 7 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <CurrencyExchange htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.currencies)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/user/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.users)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='8' selected={selectedIndex === 8} onClick={(event) => { handleListItemClick(event, 8), handleDrawerClose() }}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 8 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <PeopleAlt htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.users)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                            </Collapse></>)}
                        </Box>
                      </DrawerResponsive>
                    </div>
                    :
                    <>
                      {NavBar(false)}
                      <Drawer
                        variant="permanent"
                        open={open}
                      >

                        <DrawerHeader style={{ backgroundColor: '#0C0C0C', height: 210 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center', width: '100%', height: '100%', paddingLeft: 4.2 }}>
                            {
                              open && (
                                <>
                                  <Image
                                    src="/img/lrcp-logo.png"
                                    width={'150px'}
                                    height={'150px'}
                                    className='fadeIn'
                                  />
                                </>
                              )
                            }

                          </Box>
                          {
                            open && (
                              <IconButton onClick={handleDrawerClose} style={{ display: 'flex', justifyContent: 'center' }}>
                                {theme.direction === 'ltr' ? <ChevronLeftIcon htmlColor="#FFF" /> : <ChevronRightIcon />}
                              </IconButton>
                            )
                          }
                        </DrawerHeader>
                        <Box sx={{ width: '100%', height: '100%', padding: .5 }} id="Sidebar">
                          <NextLink href={`${'/'}`} passHref >
                            <ListItemButton
                              title={language.filter((f: any) => f.lan == 'es')?.map(f => f.home)[0]}
                              sx={{ marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='1' selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}
                              style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 1 ? '#262626 ' : '', borderRadius: '7px' }}
                              className="nextLink"
                            >
                              <ListItemIcon >
                                <HomeIcon htmlColor="#FFF" />
                                <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.home)}</Text>
                              </ListItemIcon>
                            </ListItemButton>
                          </NextLink>

                          <Divider />
                          <NextLink href={`${'/orders/list'}`} passHref >
                            <ListItemButton title={language.filter((f: any) => f.lan == 'es')?.map(f => f.sales)[0]} sx={{ marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} selected={selectedIndex === 2} id='2' onClick={(event) => handleListItemClick(event, 2)} style={{ width: '99%', backgroundColor: selectedIndex == 2 ? '#262626 ' : '', borderRadius: '7px' }}
                              className='nextLink'
                            >
                              <ListItemIcon >
                                <AttachMoneyIcon htmlColor="#FFF" />
                                <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.sales)}</Text>
                              </ListItemIcon>
                            </ListItemButton>
                          </NextLink>
                          <Divider />
                          <ListItemButton
                            title={language.filter((f: any) => f.lan == 'es')?.map(f => f.reports)[0]}
                            onClick={handleExpandReports} className="nextLink" style={{ width: '99%', borderRadius: '10px' }} sx={{ marginBottom: .5, color: '#FFF', ":hover": { backgroundColor: '#262626', borderRadius: '10px' } }}>
                            <ListItemIcon >
                              <QueryStats htmlColor="#FFF" />
                              <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.reports)}</Text>
                            </ListItemIcon>
                            <Spacer css={{ flex: 1 }} />
                            {openExpandReports ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                          <Divider />
                          <Collapse in={openExpandReports} timeout="auto" unmountOnExit sx={{ color: '#FFF' }} >
                            <NextLink href={`${'/reports/cre'}`} passHref >
                              <ListItemButton
                                title={'Reporte CRE'}
                                sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='9' selected={selectedIndex === 9} onClick={(event) => handleListItemClick(event, 9)}
                                style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 9 ? '#262626 ' : '', borderRadius: '7px' }}
                                className="nextLink"
                              >
                                <ListItemIcon >
                                  <Assessment htmlColor="#FFF" />
                                  <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{'Reporte CRE'}</Text>
                                </ListItemIcon>
                              </ListItemButton>
                            </NextLink>
                            <Divider />
                          </Collapse>
                          {userModel.IsAdmin == 1 && (<><ListItemButton
                            title={language.filter((f: any) => f.lan == 'es')?.map(f => f.adminSettings)[0]}
                            onClick={handleExpandAdminSettings} className="nextLink" style={{ width: '99%', borderRadius: '10px' }} sx={{ marginBottom: .5, color: '#FFF', ":hover": { backgroundColor: '#262626', borderRadius: '10px' } }}>
                            <ListItemIcon >
                              <Settings htmlColor="#FFF" />
                              <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.adminSettings)}</Text>
                            </ListItemIcon>
                            <Spacer css={{ flex: 1 }} />
                            {openExpandAdminSettings ? <ExpandLess /> : <ExpandMore />}
                          </ListItemButton>
                            <Divider />
                            <Collapse in={openExpandAdminSettings} timeout="auto" unmountOnExit sx={{ color: '#FFF' }} >
                              <NextLink href={`${'/products/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.products)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='3' selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 3 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <Category htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.products)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/companies/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.companies)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='4' selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 4 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <HolidayVillage htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.companies)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/ordertypes/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.ordertypes)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='5' selected={selectedIndex === 5} onClick={(event) => handleListItemClick(event, 5)}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 5 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <Loyalty htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.ordertypes)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/companytypes/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.companytypes)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='6' selected={selectedIndex === 6} onClick={(event) => handleListItemClick(event, 6)}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 6 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <BusinessIcon htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.companytypes)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/currencies/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.currencies)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='7' selected={selectedIndex === 7} onClick={(event) => handleListItemClick(event, 7)}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 7 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <CurrencyExchange htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.currencies)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                              <NextLink href={`${'/user/list'}`} passHref >
                                <ListItemButton
                                  title={language.filter((f: any) => f.lan == 'es')?.map(f => f.users)[0]}
                                  sx={{ pl: open ? 7 : 2, marginBottom: .5, ":hover": { backgroundColor: '#262626' } }} id='8' selected={selectedIndex === 8} onClick={(event) => handleListItemClick(event, 8)}
                                  style={{ marginRight: '20px', width: '99%', backgroundColor: selectedIndex == 8 ? '#262626 ' : '', borderRadius: '7px' }}
                                  className="nextLink"
                                >
                                  <ListItemIcon >
                                    <PeopleAlt htmlColor="#FFF" />
                                    <Text id='TypographySideBar' style={{ paddingTop: 4 }} hidden={!open} color='#FFF' >&nbsp;&nbsp;{language.filter((f: any) => f.lan == 'es')?.map(f => f.users)}</Text>
                                  </ListItemIcon>
                                </ListItemButton>
                              </NextLink>
                              <Divider />
                            </Collapse></>)}
                        </Box>
                      </Drawer>
                    </>

                }
                <Box sx={{ flexGrow: 1, p: 3, height: '100%', width: "100%" }} style={{ backgroundColor: "#FFFFFF" }} >
                  <DrawerHeader />
                  <Box sx={{ flexFlow: 1, width: "100%", height: '100%' }} id="Box" >
                    {children}
                  </Box>
                  <Spacer />
                  <Spacer />
                  <HideOnScrollFooter {...Props}>
                    <div className='footer'>
                      {label}
                      <Link href="https://www.deviseis.com/" style={{color:'orange', textDecoration:"none"}}>DEVISE IS</Link>
                      {label2}
                    </div>
                  </HideOnScrollFooter>
                </Box>
              </Box>
            </Grid >

            :

            <Box sx={{ flexGrow: 1, p: 3, height: '100%', width: "100%" }} style={{ backgroundColor: "#FFFFFF" }}>
              <DrawerHeader />
              <Box sx={{ flexFlow: 1, width: "100%", height: '100%' }} id="Box">
                {children}
              </Box>
            </Box>
        }


      </>

      {/*<>
        {
           Cookies.get('token') !== token && (
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <DrawerHeader />
                  <Box sx={{ flexFlow: 1, width: "100%" }} id="Box">
                    {children}
                  </Box>
                </Box>
          )
        }
        </>*/}



    </Grid >


  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {

  const { token = '' } = req.cookies;

  const response = await import(`../../lang/${locale}.json`);

  let isValidToken = false;

  try {
    await jwt.isValidToken(token);
    isValidToken = true;

  } catch (error) {
    isValidToken = false;

  }

  if (!isValidToken) {
    return {
      redirect: {
        destination: '/auth/login?p=/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}


