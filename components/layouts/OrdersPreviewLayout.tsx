import { Box, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, Button } from '@mui/material';
import { Row, Spacer } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiberManualRecord } from "@mui/icons-material";
import { ICompanies } from '../../interfaces/companies';
import { IProduct } from '../../interfaces/products';

export default function PreviewOrders(props: any) {


    const { company, date, product,
        quantity, currency, unitPriceBase,
        totalUnitPrice, vat, ieps, total, 
        base, termsCondition } = props;

    const companyData = (company || []).map((dataRow: ICompanies) => {
        return {
            Company: dataRow.Company,
            RFC: dataRow.RFC,
            Address: dataRow.Address,
            Phone: dataRow.Phone,
            TaxRegime: dataRow.TaxRegime
        }
    })

    const productData = {
        id: product.Id,
        Quantity: quantity + ' ' + product.Unit,
        Product: product.Product,
        ProductTotal: base,
    }


    const Preview = () => {

        let indexSplit = 19;

        return (

            <div className="heading2" style={{ width: '100%', height: '100%' }}>
                <div id='divToPrint' className="invoice-box" style={{ width: '216mm', height: '100%', backgroundColor: '#FFFFFF' }}>
                    <Grid container spacing={2} sx={{ display: 'flex', placeContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Grid item xs={12}>
                            <Typography variant="h6" id='TypographyNeutro'
                                component="h6"
                                align="right" sx={{ fontSize: '12px' }}>
                                {`Fecha de la Orden:${date}`}
                            </Typography>
                        </Grid>
                        <Grid item xs={2}>
                            <Image
                                loading='lazy'
                                src="/img/lrcp-logo.png"
                                width={100}
                                height={100}
                            />
                        </Grid>
                        <Grid item xs={10} display={'grid'} sx={{ placeContent: 'center', placeItems: 'center', paddingRight: 10 }}>
                            <Typography variant="h6" id='TypographyNeutro'
                                component="h6"
                                align="center"
                                sx={{ whiteSpace: 'pre-line', wordWrap: "break-word", fontSize: '12px', display: 'inline-block' }}>
                                {`LR CAPITAL PACIFICO\n RFC: LCP160530MW5\nDireccion: Av. Coahuila 444, Int A4 Col. Benito Juarez, 8355 Puerto Penasco, Sonora\nTelefono: 638 383 6320\nRegimen Fiscal: 601 - General de Ley Personas Morales`}
                            </Typography>
                        </Grid>
                        <Spacer css={{ flex: 1 }} />
                        <Grid item xs={12} marginLeft={1} sx={{ backgroundColor: 'black', borderRadius: '4px', display: 'flex', placeContent: 'start', alignContent: 'center', alignItems: 'center' }}>
                            <Typography paddingBottom={1.5} id='TypographyNeutro' sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Datos de la Empresa</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', placeContent: 'start', alignContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h6" id='TypographyNeutro'
                                component="h6"
                                align="left"
                                sx={{ whiteSpace: 'pre-line', wordWrap: "break-word", fontSize: '12px', display: 'inline-block' }}>
                                {`${companyData[0]?.Company?.toUpperCase()}  \n RFC: ${companyData[0]?.RFC?.toUpperCase()}\nDireccion: ${companyData[0]?.Address}\nTelefono: ${companyData[0]?.Phone}\nRegimen Fiscal: ${companyData[0]?.TaxRegime}`}
                            </Typography>
                        </Grid>
                        <TableContainer sx={{ paddingLeft: 1, paddingTop: 2 }}>
                            <Table>
                                <TableHead sx={{ borderRadius: '5px' }}>
                                    <TableRow key={1} sx={{ backgroundColor: 'black', borderRadius: '5px' }}>
                                        <TableCell sx={{ borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} ><Typography id='TypographyNeutro' textAlign={'left'} sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Cantidad</Typography></TableCell>
                                        <TableCell><Typography id='TypographyNeutro' textAlign={'left'} sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Producto</Typography></TableCell>
                                        <TableCell sx={{ borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }}><Typography id='TypographyNeutro' textAlign={'right'} sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Importe</Typography></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow
                                        key={productData.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell><Typography id='TypographyNeutro' paddingLeft={1.2} textAlign={'left'} sx={{ color: 'black', fontSize: '13px' }}>{productData.Quantity}</Typography></TableCell>
                                        <TableCell><Typography id='TypographyNeutro' paddingLeft={1.5} textAlign={'left'} sx={{ color: 'black', fontSize: '13px' }}>{productData.Product}</Typography></TableCell>
                                        <TableCell><Typography id='TypographyNeutro' textAlign={'right'} sx={{ color: 'black', fontSize: '13px' }}>{productData.ProductTotal}</Typography></TableCell>
                                    </TableRow>
                                    {/*productData.map((row, index) => (
                                        <>
                                            {index == indexSplit && (
                                                <>
                                                    <div className="html2pdf__page-break"></div></>)}
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell><Typography id='TypographyNeutro' paddingLeft={1.2} textAlign={'left'} sx={{ color: 'black', fontSize: '13px' }}>{row.Quantity}</Typography></TableCell>
                                                <TableCell><Typography id='TypographyNeutro' paddingLeft={1.5} textAlign={'left'} sx={{ color: 'black', fontSize: '13px' }}>{row.Product}</Typography></TableCell>
                                                <TableCell><Typography id='TypographyNeutro' textAlign={'right'} sx={{ color: 'black', fontSize: '13px' }}>{row.ProductTotal}</Typography></TableCell>
                                            </TableRow>
                                        </>
                                            ))*/}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*productData.length > 7 && (<Grid item xs={12}><div className="html2pdf__page-break"></div></Grid>)*/}
                        <Grid item xs={12} >
                            <Divider />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'grid', placeContent: 'start' }}>
                            <Row style={{ display: 'flex', justifyContent: 'start', alignContent: 'center', alignItems: 'center' }}>
                                <Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px' }}>{`Precio Base Unitario:`}</Typography>
                                <Typography id='TypographyNeutro' sx={{ fontSize: '13px', paddingLeft: .5 }}>{unitPriceBase}</Typography>
                                <FiberManualRecord fontSize="small" sx={{ paddingLeft: 1.8 }} />
                                <Typography variant="h6" id='TypographyNeutro' paddingLeft={2} sx={{ fontSize: '14px' }}>{`Precio Unitario:`}</Typography>
                                <Typography id='TypographyNeutro' sx={{ fontSize: '13px', paddingLeft: .5 }}>{totalUnitPrice}</Typography>
                            </Row>
                        </Grid>
                        <Grid marginTop={6} item xs={12} sx={{ display: 'grid', placeContent: 'end' }}>
                            <TableContainer >
                                <Table>
                                    <TableBody>
                                        <TableRow key={2}>
                                            <TableCell align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`Precio Base Total:`}</Typography></TableCell>
                                            <TableCell align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{base}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow key={3}>
                                            <TableCell align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`VAT 16%:`}</Typography></TableCell>
                                            <TableCell align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{vat}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow key={4}>
                                            <TableCell align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`IEPS:`}</Typography></TableCell>
                                            <TableCell align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{ieps}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow key={5} >
                                            <TableCell sx={{ borderBottom: 'none' }} align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`Total:`}</Typography></TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }} align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{total}</Typography></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid item xs={12} >
                            <Divider />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'grid', placeContent: 'start' }}>
                            <Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`Terminos y Condiciones`}</Typography>
                            <Typography variant="h6" id='TypographyNeutro'
                                component="h6"
                                align="left"
                                sx={{ whiteSpace: 'pre-line', wordWrap: "break-word", fontSize: '12px', display: 'inline-block' }}>
                                {termsCondition}
                            </Typography>
                        </Grid>
                    </Grid>
                </div>
            </div >
        )
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

    const handlePDF = async () => {
        const html2pdf = require('html2pdf.js');
        var element = document.getElementById('divToPrint');
        var opt = {
            margin: 5,
            filename: `${'Orden'}-${formatmmddyySave(Date.now())}.pdf`,
            image: { type: 'jpeg', quality: 1 },
            html2canvas: { scale: 3, logging: true, dpi: 200 },
            jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
            precision: 16,
            pagebreak: { after: '.html2pdf__page-break' }
        };

        await html2pdf(element, opt);
    }
    {
        /**const handlePDF = async () => {
        const input = document.getElementById("divToPrint")!;
        await html2canvas(input, { scale: 2 }).then(canvas => {
            const imgW = 208;
            const pageHeight = 295;
            const imgH = canvas.height * imgW / canvas.width;
            const imgD = canvas.toDataURL('image/jpeg');
            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addImage(imgD, 'JPEG', 0, 0, 0, imgH, 'someAlias', 'FAST');
            let heightLeft = imgH;
            let position = 0;
            while (heightLeft >= 0) {
                position = heightLeft - imgH;
                pdf.addPage();
                pdf.addImage(canvas, 'PNG', 0, position, imgW, imgH, '', 'FAST');
                heightLeft -= pageHeight;
              }
            pdf.save(`invoice${Date.now()}.pdf`)
        })
    } */
    }

    return (
        <Box sx={{ width: '100%', height: '100%', display: 'grid', placeContent: 'center' }}>
            <Preview />
        </Box>)
}