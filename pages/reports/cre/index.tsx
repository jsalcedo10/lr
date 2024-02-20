import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { Autocomplete, Box, Button, Card, CardContent, CircularProgress, Container, FormControl, Grid, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, alpha, createTheme, styled, tableCellClasses } from "@mui/material";
import { Form } from "react-bootstrap";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ICompanyTypes } from "../../../interfaces/companytypes";
import { FullScreenLoading } from "../../../components/ui";
import { useForm } from "react-hook-form";
import { ICompanies } from "../../../interfaces/companies";
import { ISales } from "../../../interfaces/Sales";
import Head from "next/head";
import { Spacer } from "@nextui-org/react";
import { ReportLayout } from "../../../components/layouts/ReportLayout";
import { CSVLink } from "react-csv";
import { useSnackbar } from "notistack";
import { IOrders } from '../../../interfaces/orders';
import { useOrderTypes } from "../../../hooks/useOrderTypes";

export default function ReportCRE(props: any) {

    const csvLinkRef = useRef<
        CSVLink & HTMLAnchorElement & { link: HTMLAnchorElement }
    >(null);

    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }, getValues, trigger, reset, setValue } = useForm<any>();

    const { Sales } = props;

    const { orderTypes, isLoadingOrderTypes } = useOrderTypes(`/ordertypes`)

    const { enqueueSnackbar } = useSnackbar();

    function getWindowDimensions() {
        if (typeof window !== "undefined") {
            const { innerWidth: width, innerHeight: height } = window;
            return {
                width,
                height
            };
        }
        return { width: 0, height: 0 }

    }

    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });

    const theme = createTheme();

    const style = {
        '& .MuiFilledInput-root': {
            border: '1px solid #e2e2e1',
            fontFamily: 'Archivo', fontWeight: 400, fontSize: '16px',
            overflow: 'hidden',
            borderRadius: '3px',
            height: 50,
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
                boxShadow: `${alpha(theme.palette.info.main, 0.25)} 0 0 0 2px`,
                borderColor: theme.palette.info.main,
            },
        },
    }

    const [isLoading, setIsLoading] = useState(false)

    const [companies, setCompanies] = useState<ICompanyTypes[]>([])
    const [sales, setSales] = useState<IOrders[]>([])

    const getCompanies = async () => {

        const result = await axios.get(`/api/companytypes`)
        if (result.status != 200) {
            return
        }
        setCompanies(result.data)
    }

    const getSales = async () => {

        const result = await axios.get(`/api/sales?isdefault=1`)
        if (result.status != 200) {
            return
        }
        setSales(result.data)
    }

    useEffect(() => {
        setIsLoading(true)
        getCompanies().then(() => {
            getSales().then(() => {
                setIsLoading(false)
            })
        });
    }, [])

    const [startDate, setStartDate] = useState<Date>(new Date(Date.now()))
    const [endDate, setEndDate] = useState<Date>(new Date(Date.now()))

    const handleChangeStarDate = (date: Date | null) => {
        if (date == null) {
            return
        }
        if (endDate < date) {
            return
        }
        setStartDate(date)
    }

    const handleChangeEndDate = (date: Date | null) => {
        if (date == null) {
            return
        }
        if (startDate > date) {
            return
        }
        setEndDate(date)
    }

    const [archiveType, setArchiveType] = useState(0)
    const [companytype, setCompanyType] = useState(0)
    const [companyByChoose, setCompanyByChoose] = useState<ICompanies[]>([])
    const [company, setCompany] = useState(0)
    const [isLoadingCompanies, setIsloadingCompanies] = useState(false)

    useEffect(() => {
        handleChangeCompany(0);
    }, [])

    const handleChangeCompany = async (companytype_id: number) => {
        setIsloadingCompanies(true)
        setCompanyType(companytype_id)
        setCompany(0)
        document.getElementById('Company')?.focus()
        await axios.get(`/api/companies?companytype_id=${companytype_id}`).then((result) => {
            if (result.status != 200) {
                return
            }
            setCompanyByChoose(result.data)
            setIsloadingCompanies(false)
        }).catch(err => { console.log(err), setIsloadingCompanies(false) })
    }

    const [PDFData, setPDFData] = useState<any>([])
    const [CSVData, setCSVData] = useState<any[]>([])

    const [isLoadingPDFData, setIsloadingPDFData] = useState(false)
    const [isLoadingCSVData, setIsloadingCSVData] = useState(false)

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

    const formatDate = (currentDate: Date, type: number) => {

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const formattedDateString = type == 1 ? `${year}-${month}-${day} 00:00:00` :
            `${year}-${month}-${day} 23:59:59`;
        return formattedDateString
    }

    const [reportName, setReportName] = useState('')

    const onCreateFile = async (data: any) => {

        setPDFData([])
        let { StartDate, EndDate, Sale } = data

        StartDate = formatDate(new Date(startDate), 1)
        EndDate = formatDate(new Date(endDate), 2)

        if (archiveType == 1) {
            setIsloadingPDFData(true)
            await axios.get(`/api/reports/cre?StartDate=${StartDate}&EndDate=${EndDate}&Sale=${Sale}`).then((result) => {
                if (result.status != 200) {
                    enqueueSnackbar('Ocurrió un error en el borrado, favor de revisar.', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        }
                    })
                    setIsloadingPDFData(false)
                    return
                }
                if (result.data.length == 0) {
                    enqueueSnackbar('No se encontraron datos en la consulta', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        }
                    })
                    setIsloadingPDFData(false)
                    return
                }
                setPDFData(result.data)
                setIsloadingPDFData(false)
                handleClickPDF()
            });
        }
        else if (archiveType == 2) {
            setIsloadingCSVData(true)
            await axios.get(`/api/reports/cre?StartDate=${StartDate}&EndDate=${EndDate}&Sale=${Sale}`).then((result) => {
                if (result.status != 200) {
                    enqueueSnackbar('Ocurrió un error en el borrado, favor de revisar.', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        }
                    })
                    setIsloadingCSVData(false)
                    return
                }
                if (result.data.length == 0) {
                    enqueueSnackbar('No se encontraron datos en la consulta', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        }
                    })
                    setIsloadingPDFData(false)
                    return
                }
                setCSVData(result.data)
                setIsloadingCSVData(false)
                setReportName(`Reporte de CRE -${formatmmddyySave(startDate)} a ${formatmmddyySave(endDate)}`)
                csvLinkRef?.current?.link.click();

            });
        }
    }

    const [openPDF, setPDF] = useState(false)
    const [refreshIn, setRefreshIn2] = useState(false);

    const setRefreshIn = () => {
        setRefreshIn2(true)
        setTimeout(() => {
            setRefreshIn2(false);
        }, 100);
    };

    const handleClickPDF = async () => {

        await setPDF(true);
        await setPDF(false);
        await setRefreshIn();

    }

    const titlesArray =
        [
            Sales.Date,
            Sales.OrderType,
            Sales.PurchaseConcept,
            Sales.Supplier,
            Sales.RFC,
            Sales.Turn,
            Sales.Type,
            Sales.Charter,
            Sales.State,
            Sales.Town,
            Sales.Product,
            Sales.Liters,
            Sales.UnitPrice,
            Sales.UnitPriceIVA,
            Sales.Carrier,
            Sales.Shipping,
            Sales.CharterPrice,
            Sales.Date,
            Sales.OrderType,
            Sales.SalesConcept,
            Sales.Client,
            Sales.RFC,
            Sales.Turn,
            Sales.Type,
            Sales.State,
            Sales.Town,
            Sales.Product,
            Sales.Liters,
            Sales.UnitPrice,
            Sales.UnitPriceIVA,
            Sales.Total,
            Sales.CharterPrice,
        ]

    const titlesArrayCSV =
        [
            { label: Sales.Date, key: 'date' },
            { label: Sales.OrderType, key: 'OrderType' },
            { label: Sales.PurchaseConcept, key: 'purchaseConcept' },
            { label: Sales.Supplier, key: 'company' },
            { label: Sales.RFC, key: 'rfc' },
            { label: Sales.Turn, key: 'turn' },
            { label: Sales.Type, key: 'type' },
            { label: Sales.Charter, key: 'charter' },
            { label: Sales.State, key: 'state' },
            { label: Sales.Town, key: 'town' },
            { label: Sales.Product, key: 'product' },
            { label: Sales.Liters, key: 'quantity' },
            { label: Sales.UnitPrice, key: 'totalUnitPrice' },
            { label: Sales.UnitPriceIVA, key: 'unitBasePrice' },
            { label: Sales.Carrier, key: 'carrier' },
            { label: Sales.Shipping, key: 'charter' },
            { label: Sales.CharterPrice, key: 'shippingCost' },
            { label: Sales.Date, key: 'date' },
            { label: Sales.OrderType, key: 'orderType' },
            { label: Sales.SalesConcept, key: 'salesConcept' },
            { label: Sales.Client, key: 'company' },
            { label: Sales.RFC, key: 'rfc' },
            { label: Sales.Turn, key: 'turn' },
            { label: Sales.Type, key: 'type' },
            { label: Sales.State, key: 'state' },
            { label: Sales.Town, key: 'town' },
            { label: Sales.Product, key: 'product' },
            { label: Sales.Liters, key: 'quantity' },
            { label: Sales.UnitPrice, key: 'totalUnitPrice' },
            { label: Sales.UnitPriceIVA, key: 'unitBasePrice' },
            { label: Sales.Total, key: 'total' },
            { label: Sales.CharterPrice, key: 'shippingCost' },
        ]

    let values: any = []

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
            backgroundColor: '#0C0C0C ',
            color: theme.palette.common.white,
            fontSize: 11,
        },
        [`&.${tableCellClasses.body}`]: {
            fontSize: 11,
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

    let titles: any = [];

    let indexSplit = 18;

    titles = [titles, ...titlesArray.map((item: any) => {
        return (
            <StyledTableCell key={item}>{item}</StyledTableCell>
        )
    })];

    values = [values, ...PDFData.map(

        (item: any, index: any) => {

            if (index == indexSplit) {
                indexSplit = (indexSplit + 19)
                return (
                    <>
                        <div className="html2pdf__page-break"></div>
                        <p></p>
                        <StyledTableRow style={{ backgroundColor: '#0C0C0C' }}>
                            {
                                titlesArray.map(
                                    (f: any) => {
                                        return (
                                            <>
                                                <StyledTableCell style={{ color: '#FFFFFF' }} component="th" scope="row">{f.toString()}</StyledTableCell>
                                            </>
                                        )
                                    }
                                )
                            }
                        </StyledTableRow>
                        <StyledTableRow
                            key={index + Math.random()}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.date}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.OrderType}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.purchaseConcept}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.company}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.rfc}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.turn}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.type}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.charter}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.state}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.town}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.product}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.quantity}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.totalUnitPrice + ' ' + item.currencyName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.unitBasePrice + ' ' + item.currencyName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.carrier}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.shipping}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.shippingCost}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.date}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.OrderType}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.salesConcept}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.company}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.rfc}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.turn}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.type}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.state}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.town}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.product}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.quantity}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.totalUnitPrice + ' ' + item.currencyName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.unitBasePrice + ' ' + item.currencyName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 100 }}>{item.total + ' ' + item.currencyName}</StyledTableCell>
                            <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.shippingCost + ' ' + item.currencyName}</StyledTableCell>
                        </StyledTableRow >
                    </>
                )
            }
            else {
                return (
                    <StyledTableRow
                        key={index + Math.random()}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.date}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.OrderType}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.purchaseConcept}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.company}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.rfc}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.turn}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.type}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.charter}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.state}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.town}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.product}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.quantity}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.totalUnitPrice + ' ' + item.currencyName}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.unitBasePrice + ' ' + item.currencyName}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.carrier}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.shipping}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 40 }}>{item.shippingCost}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.date}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.OrderType}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 10 }}>{item.salesConcept}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.company}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.rfc}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.turn}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: '100%' }}>{item.type}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.state}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 50 }}>{item.town}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.product}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.quantity}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.totalUnitPrice + ' ' + item.currencyName}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.unitBasePrice + ' ' + item.currencyName}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 100 }}>{item.total + ' ' + item.currencyName}</StyledTableCell>
                        <StyledTableCell component="th" scope="row" style={{ maxWidth: 70 }}>{item.shippingCost + ' ' + item.currencyName}</StyledTableCell>
                    </StyledTableRow >
                )
            }
        }
    )];

    return (
        <>
            <Head>
                <title>{'LR Capital'}</title>
            </Head>
            {
                openPDF
                    ?
                    <ReportLayout titles={titles} values={values} title={'Reporte de CRE'}
                        params={[{
                            endDate: endDate, startDate: startDate,
                            orderType: 'Venta',
                            concept: getValues('Sale')
                        }]} />
                    :
                    <>
                        {

                            isLoading || isLoadingOrderTypes
                                ?
                                <FullScreenLoading />
                                :
                                <>
                                    <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro' paddingBottom={1}
                                        fontWeight={500} letterSpacing={'.2px'}>Reporte CRE</Typography>
                                    <Card id="Card" sx={{ maxWidth: 900 }}>
                                        <CardContent sx={{ height: '100%' }}>
                                            <Form onSubmit={handleSubmit(onCreateFile)} style={{ width: '100%' }} className="fadeIn">
                                                <FormControl fullWidth>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} container spacing={2}>
                                                            <Grid item xs={12} height={27}>
                                                                <Typography id='Typography' >{'Rango de Fechas'}</Typography>
                                                            </Grid>
                                                            <Grid item lg={6} md={6} xs={12}>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker
                                                                        label={<Typography fontSize={'12px'} id='Typography'>{'Fecha Inicial'}</Typography>}
                                                                        InputProps={{ disableUnderline: true, style: { height: 55 } }}
                                                                        {...register('StartDate')}
                                                                        onChange={(newValue) => handleChangeStarDate(newValue)}
                                                                        value={startDate}
                                                                        renderInput={(params) =>
                                                                            <TextField
                                                                                {...register('StartDate')} variant='filled' sx={style} InputProps={{ disableUnderline: true }} InputLabelProps={{ style: { fontSize: 14, fontFamily: 'Archivo' } }} fullWidth {...params}
                                                                            />}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Grid>
                                                            <Grid item lg={6} md={6} xs={12}>
                                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                                    <DatePicker
                                                                        label={<Typography fontSize={'12px'} id='Typography'>{'Fecha Final'}</Typography>}
                                                                        InputProps={{ disableUnderline: true, style: { height: 55 } }}
                                                                        {...register('EndDate')}
                                                                        onChange={(newValue) => handleChangeEndDate(newValue)}
                                                                        value={endDate}
                                                                        renderInput={(params) =>
                                                                            <TextField variant='filled'
                                                                                {...register('EndDate')}
                                                                                sx={style} InputProps={{ disableUnderline: true }} InputLabelProps={{ style: { fontSize: 14, fontFamily: 'Archivo' } }} fullWidth {...params}
                                                                            />}
                                                                    />
                                                                </LocalizationProvider>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} xs={12}>
                                                            <Typography id='Typography' padding={.5}>{`Tipo de Orden`}</Typography>
                                                            <TextField className="fadeIn" variant='filled'
                                                                InputProps={{ disableUnderline: true, sx: { fontFamily: 'Archivo' } }}
                                                                id='OrderType'
                                                                fullWidth
                                                                sx={style}
                                                                value={orderTypes?.filter(f => f?.IsDefault == 1)[0].Id}
                                                                {...register('OrderType', { required: Sales.required })}
                                                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Seleccione un Tipo de Orden</Typography>}
                                                                error={!!errors.Sale}
                                                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                                                helperText={errors.Sale?.message}
                                                                select SelectProps={{
                                                                    MenuProps:
                                                                    {
                                                                        anchorOrigin: {
                                                                            vertical: "bottom",
                                                                            horizontal: "left"
                                                                        },
                                                                        transformOrigin: {
                                                                            vertical: "top",
                                                                            horizontal: "left"
                                                                        }, disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                                                            className: 'select', sx: {
                                                                                borderRadius: '8px',
                                                                                maxHeight: 300,
                                                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                                                            }
                                                                        }
                                                                    }
                                                                }} >
                                                                {orderTypes?.filter(f => f?.IsDefault == 1).map((orderType: any) => {
                                                                    return (
                                                                        <MenuItem style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 400, fontSize: '16px' }} key={orderType.Id} value={orderType.Id} >{orderType.OrderType}</MenuItem>
                                                                    )
                                                                })}
                                                            </TextField>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} xs={12}>
                                                            <Typography id='Typography' padding={.5}>{`Concepto (Ventas)`}</Typography>
                                                            <TextField className="fadeIn" variant='filled'
                                                                InputProps={{ disableUnderline: true, sx: { fontFamily: 'Archivo' } }}
                                                                id='Sale'
                                                                fullWidth
                                                                sx={style}
                                                                {...register('Sale', { required: Sales.required })}
                                                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Seleccione un Concepto</Typography>}
                                                                defaultValue={'Todos'}
                                                                error={!!errors.Sale}
                                                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                                                helperText={errors.Sale?.message}
                                                                select SelectProps={{
                                                                    MenuProps:
                                                                    {
                                                                        anchorOrigin: {
                                                                            vertical: "bottom",
                                                                            horizontal: "left"
                                                                        },
                                                                        transformOrigin: {
                                                                            vertical: "top",
                                                                            horizontal: "left"
                                                                        }, disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                                                            className: 'select', sx: {
                                                                                borderRadius: '8px',
                                                                                maxHeight: 300,
                                                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                                                            }
                                                                        }
                                                                    }
                                                                }} >
                                                                <MenuItem style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 400, fontSize: '16px' }} key={0} value={'Todos'} >{'Todos'}</MenuItem>
                                                                {sales?.filter(f => f.Concept != '').map((sale: any) => {
                                                                    return (
                                                                        <MenuItem style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 400, fontSize: '16px' }} key={sale.Concept} value={sale.Concept} >{sale.Concept}</MenuItem>
                                                                    )
                                                                })}
                                                            </TextField>
                                                        </Grid>

                                                        <Grid item lg={6} md={6} xs={12}>
                                                            <Button type='submit'
                                                                onClick={() => setArchiveType(1)}
                                                                variant="contained"
                                                                disabled={isLoadingPDFData}
                                                                id='Button2' fullWidth >{isLoadingPDFData ?
                                                                    <CircularProgress size={25} color="inherit" /> : 'Generar PDF'}</Button>
                                                        </Grid>
                                                        <Grid item lg={6} md={6} xs={12}>

                                                            <CSVLink
                                                                data={CSVData}
                                                                headers={titlesArrayCSV}
                                                                className="exportButton"
                                                                filename={reportName}
                                                                ref={csvLinkRef}
                                                            >
                                                            </CSVLink>
                                                            <Button
                                                                color="primary"
                                                                variant="contained"
                                                                size="small"
                                                                type='submit'
                                                                id='Button2'
                                                                sx={{ width: '100%' }}
                                                                disabled={isLoadingCSVData}
                                                                onClick={() => setArchiveType(2)}
                                                            >{isLoadingCSVData ? <CircularProgress size={25} color="inherit" /> : 'Generar CSV'}
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </FormControl>
                                            </Form>
                                        </CardContent>
                                    </Card>
                                </>
                        }
                    </>
            }

        </>
    )

}

export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {

    const { token = '' } = req.cookies;
    const response = await import(`../../../lang/${locale}.json`);
    let isValidToken = false;

    try {
        await jwt.isValidToken(token);
        isValidToken = true;

    } catch (error) {
        isValidToken = false;

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
        props: { Sales: response.default.Sales }
    }
}