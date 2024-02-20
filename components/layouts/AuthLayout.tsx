import { FC, useContext } from 'react';
import Head from 'next/head';
import { Box } from '@mui/material';
import { AuthContext } from '../../context/auth/AuthContext';
import { FullScreenLoading } from '../ui/FullScreenLoading';
import Cookies from 'js-cookie';
import { Image } from '@nextui-org/react';

interface Props {
    title: string;
}

export const AuthLayout: FC<Props> = ({title = 'Login',  children }) => {

  const {user, token} = useContext(  AuthContext );

  return (

    <>
          <Head>
            <title>{ title }</title>
          </Head>
        <div >
        {

            Cookies.get("token") != token && (

            <Box display='flex' justifyContent='center' alignItems='center' height="calc(100vh - 300px)" >   

                { children }
            </Box>
            
            )

          }
        </div>
    </>
  )
}
