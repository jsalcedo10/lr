import { FC, useState, useContext, useEffect } from 'react';
import Head from 'next/head';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { SideMenu } from '../ui';
import { PersistentDrawerLeft } from './SidebarReact';
import { FullScreenLoading } from '../ui/FullScreenLoading';
import { useRouter } from 'next/router';
import { truncate } from 'fs/promises';
import FadeIn from 'react-fade-in';
import { SWRConfig } from 'swr';
import { AuthContext } from '../../context/auth/AuthContext';
import styles from './EntityLayout.module.css';
import { LicenseInfo } from '@mui/x-license-pro';
import Link from 'next/link';
import { Spacer } from '@nextui-org/react';
import { FooterLayout } from './FooterLayout';

interface Props {
  title?: string;
}
LicenseInfo.setLicenseKey(
  '2dc0b3b57db014a6f12dade3934e53beT1JERVI6NDI5NDMsRVhQSVJZPTE2ODMxMzM1NzYwMDAsS0VZVkVSU0lPTj0x',
);

export const InvoiceLayout: FC<Props> = ({ title, children }) => {

  const { user } = useContext(AuthContext);

  const [refreshIn, setRefreshIn] = useState(false);

  /*useEffect(() => {
    setTimeout(() => {
      setRefreshIn(false);
    }, 500);
  }, []);*/


  return (

    <>
      {

        refreshIn

          ?

          <FullScreenLoading />

          :

          <>

            {

              !user

                ?

                <FullScreenLoading />

                :

                <Box >

                  {/*<FadeIn>*/}
                  <Head>
                    <title>{title}</title>
                  </Head>
                  <div style={{ alignItems: 'center', justifyContent: "center", display: "flex", height: '100%' }} >

                    <Box className='fadeIn' sx={{ flexFlow: 1, width: '60%', minWidth: '45vh' }}>
                      {children}
                    </Box>


                  </div>

                  {/*</FadeIn>*/}
                </Box>

            }

          </>


      }

    </>


  );

};

