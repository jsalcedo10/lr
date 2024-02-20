import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UIProvider } from '../context/ui/UIProvider';
import { CssBaseline } from '@mui/material';
import { NextUIProvider } from "@nextui-org/react"
import { AuthContext, AuthProvider } from '../context/auth';
import { SessionProvider, useSession } from 'next-auth/react'
import { PersistentDrawerLeft } from '../components/layouts/SidebarReact';
import { UserProvider } from '../context/user/UserProvider';
import { SWRConfig } from 'swr';
import { SnackbarProvider } from 'notistack';

function MyApp({ Component, pageProps }: AppProps) {

  return (

    <SessionProvider>
      <SWRConfig value={{
        fetcher: (resource, init) => fetch(resource, init).then(res => res.json())
      }}>
        <SnackbarProvider maxSnack={3}>
          <AuthProvider>
            <UserProvider>
              <UIProvider>
                <NextUIProvider>
                  <CssBaseline />
                  <PersistentDrawerLeft {...pageProps}>
                    <Component {...pageProps} />
                  </PersistentDrawerLeft>
                </NextUIProvider>
              </UIProvider>
            </UserProvider>
          </AuthProvider>
        </SnackbarProvider>
      </SWRConfig>
    </SessionProvider>
  )
}

export default MyApp
