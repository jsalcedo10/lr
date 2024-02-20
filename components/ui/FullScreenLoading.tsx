import { Box, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { Text, Spacer } from '@nextui-org/react';
import { useRouter } from 'next/router';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps,
} from '@mui/material/CircularProgress';
import Cookies from 'js-cookie';
import FadeIn from 'react-fade-in';

export const FullScreenLoading = (props: CircularProgressProps) => {

  const router = useRouter();

  const lang = useMemo(() => {

    return Cookies.get('Lang');

  }, [Cookies.get('Lang')])

  const language = [
    {
      lan: 'en',
      loading: 'Loading'
    },
    {
      lan: 'es',
      loading: 'Cargando'
    }
  ];
  return (
    <FadeIn>
      <Box
        sx={{ display: 'grid', placeItems: 'center' }}
        height='calc(100vh - 200px)'
        flexWrap={'wrap'}
      >

        <Box sx={{ position: 'relative', placeItems: 'center', display: 'grid' }} flexWrap={'wrap'}>
          <Text h1
            className='animate-charcter'
            size={30}
            style={{ position: 'absolute', top: '53px', 
            fontFamily: 'M S PLUS 2', fontWeight: 600, letterSpacing:'-0.01px'}}
          >
            {language.filter((f: any) => f.lan == router.locale)?.map(f => f.loading)}
          </Text>
          <CircularProgress size={50} thickness={4} value={100} variant="determinate" sx={{
            display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center',
            color: (theme) =>
              //theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
              (theme.palette.mode === 'light' ? '#CDCDCD' : '#3E3E3E'),

          }} {...props} />

          <CircularProgress
            variant="indeterminate"
            sx={{
              display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center',
              color: (theme) => (theme.palette.mode === 'light' ? '#3E3E3E' : '#222222'),
              animationDuration: '1000ms',
              position: 'absolute',
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round',
              },
            }}
            size={50}
            thickness={4}

            {...props}
          />

        </Box>

      </Box>
    </FadeIn>
  )
}
