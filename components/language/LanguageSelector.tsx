import React, { FC } from 'react';
import { useRouter } from 'next/router';
import { alpha, Box, createTheme, MenuItem, TextField, OutlinedInputProps } from '@mui/material';
import { useFlags } from '../../hooks/useFlags';
import { Loading, Spacer } from '@nextui-org/react';
import { Col, Row } from 'react-bootstrap';
import { useEffect } from 'react';

interface Props {
    label: string;
}
export const LanguageSelector: FC<Props> = ({ label }) => {

    const router = useRouter();

    const { flags, isLoadingFlag } = useFlags('://restcountries.com/v3.1/all');

    const flagsCountry = (flags || []).map(
        dataRow => {
            return {
                Name: dataRow.name.common,
                flag: dataRow.flags.png
            }
        }
    )

    useEffect(() => {
        if (router.locale != 'en') {
            router.push(router.pathname, router.pathname, {
                locale: 'en',
            });
        }
    }, [])

    // console.log(router);
    const changeLang = (e) => {
        router.push(router.pathname, router.pathname, {
            locale: e.target.value,
        });
    }

    const theme = createTheme();

    const style = {
        '& .MuiFilledInput-root': {
            border: '1px solid #e2e2e1',
            overflow: 'hidden',
            fontFamily: 'Nunito Sans',
            borderRadius: '7px',
            fontSize: '15px',
            fontWeight: 500,
            letterSpacing: 0,
            backgroundColor: theme.palette.mode === 'light' ? '#fcfcfb' : '#2b2b2b',
            transition: theme.transitions.create([
                'border-color',
                'background-color',
                'box-shadow',
            ]),
            '&:hover': {
                backgroundColor: 'transparent',
            },
            '&.Mui-focused': {
                backgroundColor: 'transparent',
                boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 2px`,
                borderColor: theme.palette.primary.main,
            },
        },
    }
    return (
        <>
            {
                isLoadingFlag

                    ?
                    <Box style={{ height: 55, width: '100%', padding: 5, paddingLeft: 135 }}>
                        <Loading />
                    </Box>
                    :
                    <TextField
                        sx={style}
                        variant='filled'
                        InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
                        fullWidth
                        label={label}
                        select
                        defaultValue={'en'}
                        onChange={changeLang}
                        SelectProps={{
                            MenuProps:
                            {
                                TransitionProps: { timeout: 0 },
                                anchorOrigin: {
                                    vertical: "bottom",
                                    horizontal: "left"
                                },
                                transformOrigin: {
                                    vertical: "top",
                                    horizontal: "left"
                                }, disableScrollLock: false, PaperProps: {
                                    className: 'select', sx: {
                                        borderRadius: '8px',
                                        boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                    }
                                }
                            }
                        }}
                    >
                        <MenuItem style={{ margin: '.5rem', borderRadius: '8px', height: '35px', color: '#445450', fontWeight: 600, fontSize: '16px', fontFamily: 'Nunito Sans' }} key={'en'} value={'en'}>
                            {router.locale == 'en' ? 'English' : 'Inglés'}
                            <img style={{ width: 40, paddingLeft: 10 }} src={flagsCountry.filter(c => c.Name == 'United States').map(f => f.flag)[0]}></img>
                        </MenuItem>
                        <MenuItem style={{ margin: '.5rem', borderRadius: '8px', height: '35px', color: '#445450', fontWeight: 600, fontSize: '16px', fontFamily: 'Nunito Sans' }} key={'es'} value={'es'} >
                            {router.locale == 'es' ? 'Español' : 'Spanish'}
                            <img style={{ width: 40, paddingLeft: 10 }} src={flagsCountry.filter(c => c.Name == 'Mexico').map(f => f.flag)[0]}></img>
                        </MenuItem>
                    </TextField>
            }

        </>
    );
}