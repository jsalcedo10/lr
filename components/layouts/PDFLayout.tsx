import { FC, useContext, useState, useEffect } from 'react';
import Head from 'next/head';
import { Box, ListItem, TableCell, TableContainer, TableHead, Table, TableRow, TableBody, Typography } from '@mui/material';
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
}

export const PDFLayout: FC<Props> = ({ titles, values, title }) => {

    const { user, token } = useContext(AuthContext);

    const [refreshIn, setRefreshIn] = useState(true);

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            color: theme.palette.common.white,
            fontSize: 15
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 15,
        },
    }));

    const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
            border: 0,
        },
    }));

    useEffect(() => {
        exportPDF();
    }, [])


    const exportPDF = async () => {
        const html2pdf = require('html2pdf.js');
        var element = document.getElementById('divToPrint');
        var opt = {
            margin: 2,
            filename: `${title}_${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, logging: true, dpi: 200, letterRendering: true },
            jsPDF: { unit: 'mm', format: title.toLocaleLowerCase() == 'reporte de orden' ? 'a1':'a3', orientation: 'landscape' },
            precision: 16,
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
                                <div id='divToPrint' className="reports-box" style={{ width: '100%', height: '100%' }}>
                                    <TableContainer sx={{ borderRadius: "8px" }}>
                                        <Typography paddingBottom={2} id='TypographyNeutro' sx={{ fontWeight: 500 }}>{title}</Typography>
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

            </Box>


        </>

    );

};

