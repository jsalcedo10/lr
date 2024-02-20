import { FC, useContext, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import { FullScreenLoading, SideMenu } from '../ui';
import { Col, Text, Spacer } from '@nextui-org/react';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import { AuthContext } from '../../context/auth/AuthContext';
import { useRouter } from 'next/router';
import { FooterLayout } from './FooterLayout';
import Cookies from 'js-cookie';
import { useSession } from 'next-auth/react';


interface Props {
  title: string;
  subTitle: JSX.Element;
  icon?: JSX.Element;
}

export const DashboardLayout: FC<Props> = ({ children, title, subTitle, icon }) => {

  const { user } = useContext(AuthContext);
  //const user = useSession();
  const [refreshIn, setRefreshIn] = useState(true);

  const router = useRouter();

  return (

    <>

      <Head>
        <title>{'LR Capital'}</title>
      </Head>
      <div>
        {
          user == undefined

            ?

            <FullScreenLoading />

            :
            
            <>

              <Box display="flex" flexDirection='column'>
                <Typography 
                id='TypographyNeutro'
                variant='h1'
                fontSize={30}
                fontWeight = {600}
                letterSpacing={'.1px'}
                color={'#3E3E3E'}
                >
                  {title}
                </Typography>
                <Typography variant='h4' sx={{ mb: 1, padding: '0px 39px' }}>{' '} {subTitle}</Typography>

              </Box>

              <Box className='fadeIn' sx={{ flexFlow: 1 }}>
                {children}
                <Spacer css={{ flex: 1 }} />
                <Spacer css={{ flex: 1 }} />
              </Box>
            </>

        }
      </div>

    </>

  )
}


