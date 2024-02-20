import { FC, useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, ListItem, TableCell, TableContainer, TableHead, Table, TableRow, TableBody, Typography, Stack, Grid } from '@mui/material';
import { PersistentDrawerLeft } from './SidebarReact';
import FadeIn from 'react-fade-in';
import { LicenseInfo } from '@mui/x-license-pro';
import { SWRConfig } from 'swr';
import { AuthContext } from '../../context/auth/AuthContext';
import { FullScreenLoading } from '../ui/FullScreenLoading';
import { ChaseContext } from '../../context/chase/ChaseContext';
import styles from './EntityLayout.module.css';
import Cookies from 'js-cookie';
import Paper from '@mui/material/Paper';
import { tableCellClasses } from '@mui/material/TableCell';
import { styled } from '@mui/material/styles';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Button, Spacer, Row } from '@nextui-org/react';
import { Col } from 'react-bootstrap';

LicenseInfo.setLicenseKey(
    '2dc0b3b57db014a6f12dade3934e53beT1JERVI6NDI5NDMsRVhQSVJZPTE2ODMxMzM1NzYwMDAsS0VZVkVSU0lPTj0x',
);


interface Props {
    titles: string[];
    values: any[];
    title: string;
    params: any[]
}

export const ReportLayout: FC<Props> = ({ titles, values, title, params }) => {

    const { user, token } = useContext(AuthContext);

    useEffect(() => {
        exportPDF();
    }, [])

    function formatmmddyy(date: any) {
        if (!date) {
            return ''
        }
        date = new Date(date);

        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        return (day + '/' + month + '/' + year);
    }

    function formatmmddyySave(date: any) {
        if (!date) {
            return ''
        }
        date = new Date(date);

        var day = ('0' + date.getDate()).slice(-2);
        var month = ('0' + (date.getMonth() + 1)).slice(-2);
        var year = date.getFullYear();

        return (day + '-' + month + '-' + year);
    }


    const exportPDF = async () => {
        const html2pdf = require('html2pdf.js');
        var element = document.getElementById('divToPrint');
        var opt = {
            margin: 2,
            filename: `${title}-${formatmmddyySave(params[0]?.startDate) + '-a-' + formatmmddyySave(params[0]?.endDate)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 200, letterRendering: true },
            jsPDF: { unit: 'mm', format: title.toLocaleLowerCase() == 'reporte de cre' ? 'a1' : 'a3', orientation: 'landscape' },
            precision: 16,
            pagebreak: { after: '.html2pdf__page-break' }
        };

        await html2pdf(element, opt);
    }

    return (

        <>
            <Row>
                <Col style={{ width: '850%' }}>
                    <h3 id="h2">Reports</h3>
                </Col>
                <Spacer css={{ flex: 1 }} />
                <Col style={{ width: '15%' }}>
                    <Button onClick={exportPDF}>Download PDF</Button>
                </Col>
            </Row>

            <Box sx={{ flexFlow: 1 }} >


                {/*<FadeIn>*/}


                {

                    !user

                        ?

                        <FullScreenLoading />

                        :
                        <>

                            <div className="heading2" style={{ width: '100%', height: '100%' }}>
                                <div id='divToPrint' style={{ width: '100%', height: '100%' }}>
                                    <TableContainer sx={{ borderRadius: "8px" }}>
                                        {title.toLocaleLowerCase() == 'reporte de cre' ? <Grid container padding={1.5} spacing={2}>
                                            <Grid item xs={6} display={'flex'} justifyContent={'start'} >
                                                <Col>
                                                    <Row>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '16px', color: 'rgb(255,153,52)' }}>{title}</Typography>
                                                    </Row>
                                                    <Row>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px' }}>{'Fecha de Creación: '}</Typography>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px', color: '#747474', paddingLeft: 1 }}>{formatmmddyy(new Date(Date.now()))}</Typography>
                                                    </Row>
                                                    <Row>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px' }}>{'Rango de Fecha: '}</Typography>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px', color: '#747474', paddingLeft: 1 }}>{formatmmddyy(params[0]?.startDate) + ' a ' + formatmmddyy(params[0]?.endDate)}</Typography>
                                                    </Row>
                                                    <Row>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px' }}>{'Tipo de Orden: '}</Typography>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px', color: '#747474', paddingLeft: 1 }}>{params[0]?.orderType}</Typography>

                                                    </Row>
                                                    <Row>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px' }}>{'Concepto: '}</Typography>
                                                        <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '14px', color: '#747474', paddingLeft: 1 }}>{params[0]?.concept}</Typography>
                                                    </Row>
                                                </Col>

                                            </Grid>
                                            <Grid item xs={6} display={'flex'} justifyContent={'end'}>
                                                <td>
                                                    <img src="/img/lrcp-logo.png"
                                                        style={{ width: '100%', height: '70%' }}>
                                                    </img>
                                                </td>
                                            </Grid>

                                        </Grid>
                                            :
                                            <Typography id='TypographyNeutro' sx={{ fontWeight: 500, fontSize: '16px', color: 'rgb(255,153,52)' }}>{title}</Typography>
                                        }
                                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                            <TableHead style={{ backgroundColor: '#011b34' }}>
                                                <TableRow key={1}>
                                                    {titles}
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {values}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </div>



                        </>




                }


                {/*</FadeIn>*/}

            </Box >


        </>

    );

};

