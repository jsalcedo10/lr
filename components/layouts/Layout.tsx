import { FC, useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, Card, CardContent, Grid } from '@mui/material';
import { PersistentDrawerLeft } from './SidebarReact';
import FadeIn from 'react-fade-in';
import { LicenseInfo } from '@mui/x-license-pro';
import { SWRConfig } from 'swr';
import { AuthContext } from '../../context/auth/AuthContext';
import { FullScreenLoading } from '../ui/FullScreenLoading';
import styles from './EntityLayout.module.css';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Spacer } from '@nextui-org/react';
import { FooterLayout } from './FooterLayout';

LicenseInfo.setLicenseKey(
  '2dc0b3b57db014a6f12dade3934e53beT1JERVI6NDI5NDMsRVhQSVJZPTE2ODMxMzM1NzYwMDAsS0VZVkVSU0lPTj0x',
);

interface Props {
  title?: string;
}

export const Layout: FC<Props> = ({ title = 'CHASE', children }) => {

  const { user, token } = useContext(AuthContext);
  const [refreshIn, setRefreshIn] = useState(false);

  /*useEffect(() => {
    setTimeout(() => {
      setRefreshIn(false);
    }, Cookies.get('token') ? 100 : 1500);
  }, []);*/

  return (
    <>
      {

        refreshIn

          ?

          <FullScreenLoading />

          :

          <>
            <Box sx={{ flexFlow: 1 }} >


              {/*<FadeIn>*/}
              <Head>
                <title>{'LR Capital'}</title>
              </Head>
              <div>

                {

                  !user

                    ?

                    <FullScreenLoading />

                    :

                    <Box className='fadeIn' sx={{ flexFlow: 1 }}>
                      <Card id="Card" className="each-slide" sx={{ display: 'flex', height: '100%', width: '100%' }} >
                        <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column', width: '100%' }}>
                          {children}
                        </CardContent>
                      </Card>
                    </Box>
                }
              </div>
            </Box>

          </>
      }

    </>

  );

};

