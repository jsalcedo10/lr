import { FC, useEffect, useState } from 'react';
import Head from 'next/head';
import { Box,  } from '@mui/material';
import {   SideMenu } from '../ui';
import { PersistentDrawerLeft } from './SidebarReact';
import { FullScreenLoading } from '../ui/FullScreenLoading';

interface Props {
    title?: string;
}


export const DetailsLayout:FC<Props> = ({ title , children }) => {
  return (

      <Box sx={{ flexFlow: 1 }} className='fadeIn'>

          <Head>
                <title>{ title }</title>
          </Head>
                <Box sx={{ flexFlow :1 , width :"100%", alignItems: 'center' }} id="Box">
                        { children }
                    </Box>
            <SideMenu />
      </Box>
  )
};
