import { FC } from 'react';

import { Grid,  CardContent, Typography } from '@mui/material';
import { SWRConfig } from 'swr';
import {  Card } from '@nextui-org/react';
import { useRouter } from 'next/router';

interface Props {
    title: string | number;
    subTitle: string;
    icon: JSX.Element;
    path: string;

}


export const SummaryTile:FC<Props> = ({ title, subTitle, icon, path }) => {

  const router = useRouter();

  const navigateTo = ( url: string ) => {
      router.push(url);
  };

  return (
    
      <Grid item xs={12} sm={4} md={3} style={{ width: '100%', height:'100%'}}>
        <Card css={{ width: '100%', height:'100%', boxShadow:'none', borderRadius: '10px', border: '1px solid #eaeaea'}} hoverable clickable onClick={() => navigateTo(`${path}`) }>
            <CardContent sx={{ width: 50, display:'flex', justifyContent: 'center', alignItems: 'center' }}>
                {/* <CreditCardOffOutlined color="secondary" sx={{ fontSize: 40 }} /> */}
                { icon }
            </CardContent>
            <CardContent sx={{ flex: '1 0 auto', display: 'flex', flexDirection: 'column' }}>
                <Typography variant='h3'>{ title }</Typography>
                <Typography variant='caption'>{ subTitle }</Typography>
            </CardContent>
        </Card>
    </Grid>


  )
}
