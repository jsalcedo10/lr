import { FC, useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { FullScreenLoading, SideMenu } from '../ui';
import { Col, Text } from '@nextui-org/react';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Slide from '@mui/material/Slide';

interface Props {
  title: string;
  subTitle: JSX.Element;
  icon?: JSX.Element;
  window?: () => Window;
  children: React.ReactElement;
  props?: Props;
}

export const FooterLayout = (props: any) => {

  const [triger, settriger] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      settriger(true);

    }, 100);
  }, []);
  function HideOnScroll(props: Props) {
    const { children, window } = props;
    const trigger = useScrollTrigger({
      target: window ? window() : undefined,
    });
    
    return (
      <Slide appear={trigger == true ? triger : trigger} direction="up" in={triger == false ? false : !trigger}>
        {children}
      </Slide>
    );
  }

  const router = useRouter();
  const label = router.locale == 'en' ? 'CYD Developed by ' : 'CYD Desarrollado por '
  const label2 = ' IS S.A de C.V'

  return (

    <HideOnScroll {...props}>
      <div className='footer'>
        {label}
        <Link href="https://www.deviseis.com/">DEVISE</Link>
        {label2}
      </div>
    </HideOnScroll>
  )
}


