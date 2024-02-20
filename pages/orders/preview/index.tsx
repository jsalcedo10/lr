import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { Box, Divider, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, CircularProgress, Button } from '@mui/material';
import { Row, Spacer } from "@nextui-org/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiberManualRecord } from "@mui/icons-material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PreviewOrders(props: any) {

    const product = [
        { id: 1, Quantity: '5,000.00000 Litros', Product: 'Diesel / Ultrabajo en azufre', ProductTotal: '$85,630.921875 USD' },
        { id: 2, Quantity: '2,000.00000 Litros', Product: 'Diesel / Ultrabajo en azufre', ProductTotal: '$80,610.921875 USD' },
        { id: 3, Quantity: '2,000.00000 Litros', Product: 'Diesel / Ultrabajo en azufre', ProductTotal: '$80,610.921875 USD' },
        { id: 4, Quantity: '2,000.00000 Litros', Product: 'Diesel / Ultrabajo en azufre', ProductTotal: '$80,610.921875 USD' },
        { id: 5, Quantity: '2,000.00000 Litros', Product: 'Diesel / Ultrabajo en azufre', ProductTotal: '$80,610.921875 USD' },
        { id: 6, Quantity: '2,000.00000 Litros', Product: 'Diesel / Ultrabajo en azufre', ProductTotal: '$80,610.921875 USD' },

    ]

    const [productData, setProductData] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const handleProduct = async () => {
        setProductData(product)
    }

    useEffect(() => {
        setIsLoading(true)
        handleProduct().then(() => {
            setIsLoading(false)
        })
    }, [])

    const date = new Date(Date.now())?.toLocaleDateString()  

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
                            <Typography paddingBottom={1.5} id='TypographyNeutro' sx={{ color: 'white', fontSize: '14px', fontWeight: 600 }}>Datos del Cliente</Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'flex', placeContent: 'start', alignContent: 'center', alignItems: 'center' }}>
                            <Typography variant="h6" id='TypographyNeutro'
                                component="h6"
                                align="left"
                                sx={{ whiteSpace: 'pre-line', wordWrap: "break-word", fontSize: '12px', display: 'inline-block' }}>
                                {`LR CAPITAL PACIFICO\n RFC: LCP160530MW5\nDireccion: Av. Coahuila 444, Int A4 Col. Benito Juarez, 8355 Puerto Penasco, Sonora\nTelefono: 638 383 6320\nRegimen Fiscal: 601 - General de Ley Personas Morales`}
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
                                    {productData.map((row, index) => (
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
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {productData.length > 7 && (<Grid item xs={12}><div className="html2pdf__page-break"></div></Grid>)}
                        <Grid item xs={12} >
                            <Divider />
                        </Grid>
                        <Grid item xs={12} sx={{ display: 'grid', placeContent: 'start' }}>
                            <Row style={{ display: 'flex', justifyContent: 'start', alignContent: 'center', alignItems: 'center' }}>
                                <Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px' }}>{`Precio Base Unitario:`}</Typography>
                                <Typography id='TypographyNeutro' sx={{ fontSize: '13px', paddingLeft: .5 }}>{'$17.1261844 USD'}</Typography>
                                <FiberManualRecord fontSize="small" sx={{ paddingLeft: 1.8 }} />
                                <Typography variant="h6" id='TypographyNeutro' paddingLeft={2} sx={{ fontSize: '14px' }}>{`Precio Unitario:`}</Typography>
                                <Typography id='TypographyNeutro' sx={{ fontSize: '13px', paddingLeft: .5 }}>{'$20.300000 USD'}</Typography>
                            </Row>
                        </Grid>
                        <Grid marginTop={6} item xs={12} sx={{ display: 'grid', placeContent: 'end' }}>
                            <TableContainer >
                                <Table>
                                    <TableBody>
                                        <TableRow key={2}>
                                            <TableCell align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`Precio Base Total:`}</Typography></TableCell>
                                            <TableCell align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{`$85,630.921875 USD`}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow key={3}>
                                            <TableCell align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`VAT 16%:`}</Typography></TableCell>
                                            <TableCell align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{`$13,700.947500 USD`}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow key={4}>
                                            <TableCell align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`IEPS:`}</Typography></TableCell>
                                            <TableCell align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{`$2,168.130000 USD`}</Typography></TableCell>
                                        </TableRow>
                                        <TableRow key={5} >
                                            <TableCell sx={{ borderBottom: 'none' }} align="right"><Typography variant="h6" id='TypographyNeutro' sx={{ fontSize: '14px', fontWeight: 600 }}>{`Total:`}</Typography></TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }} align="left"><Typography id='TypographyNeutro' paddingTop={.3} sx={{ fontSize: '13px' }} textAlign={'left'}>{`$101,500.000000 USD`}</Typography></TableCell>
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
                                {`Uso CFEDi G03 - Gastos en General Uso CFEDi G03 - Gastos en GeneralUso CFEDi G03 - Gastos en GeneralUso CFEDi G03 - Gastos en GeneralUso CFEDi G03 - Gastos en GeneralUso CFEDi G03 - Gastos en GeneralUso CFEDi G03 - Gastos en General`}
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
            <Button id='Button2' fullWidth sx={{ marginBottom: 1 }} onClick={handlePDF}> PDF</Button>
            {
                isLoading
                    ?
                    <Box width={'100%'} height={800} sx={{ display: 'grid', placeContent: 'center' }}>
                        <CircularProgress color="inherit" size={50} />
                    </Box>
                    :
                    <Preview />
            }
        </Box>)
}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {
    const { token = '' } = req.cookies;
    const response = await import(`../../../lang/${locale}.json`);
    let isValidToken = false;
    let isAdmin = false;

    try {
        await jwt.isValidToken(token);
        isValidToken = true;
        isAdmin = Boolean(await jwt.isAdmin(token));
    } catch (error) {
        isValidToken = false;
        isAdmin = false;
    }

    if (!isAdmin) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        }
    }

    if (!isValidToken) {
        return {
            redirect: {
                destination: '/auth/login?p=/',
                permanent: false,
            }
        }
    }

    return {
        props: { Sales: response.default.Sales || null }
    }
}
