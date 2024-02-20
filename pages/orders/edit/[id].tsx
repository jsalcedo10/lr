import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { useRouter } from "next/router";
import { EntityLayout, Layout } from "../../../components/layouts";
import { OutlinedInputProps, Select, InputLabel, SelectChangeEvent, Alert, AlertTitle, Button, Card, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Slide, TextField, Typography, alpha, createTheme, Box, Dialog, AppBar, Toolbar, DialogTitle, Tooltip, Grow, formLabelClasses, Divider, DialogContent, DialogActions } from "@mui/material";
import { Form } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { Spacer, Text } from "@nextui-org/react";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "notistack";
import { ISales } from "../../../interfaces/Sales";
import { IProduct } from "../../../interfaces/products";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useOrderTypes } from '../../../hooks/useOrderTypes';
import { useCompanyTypes } from '../../../hooks/useCompanyTypes';
import { useCompanies } from '../../../hooks/useCompanies';
import { useProducts } from '../../../hooks/useProducts';
import { useCurrency } from '../../../hooks/useCurrency';
import { SalesContext } from '../../../context/sales/SalesContext';
import { ICurrencies } from "../../../interfaces/currencies";
import { ICompanies } from "../../../interfaces/companies";
import PreviewOrders from "../../../components/layouts/OrdersPreviewLayout";
import { IOrders } from "../../../interfaces/orders";
import { Close, ClosedCaption } from "@mui/icons-material";
import { OrdersLayout } from "../../../components/layouts/OrdersLayout";
import { useOrders } from "../../../hooks/useOrders";

export default function SalesRegister(props: any) {
    // const { registerSale } = useContext(SalesContext);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm<ISales>();

    const { Sales } = props;

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
    const { orderTypes, isLoadingOrderTypes } = useOrderTypes('/ordertypes');
    const [ordertype, setOrderTypeActual] = useState<any[]>([]);
    const [companiesA, setCompaniesActual] = useState<any[]>([]);
    const { companyTypes, isLoadingCompanyTypes } = useCompanyTypes('/companytypes');
    const [companytype, setCompanyTypeActual] = useState<any[]>([]);
    const { companies, isLoadingCompanies } = useCompanies('/companies');
    const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [subsidiary, setSubsidiaryActual] = useState<any[]>([]);
    const { products, isLoadingProduct } = useProducts('/products');
    const [productActual, setProductActual] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
    const [ieps, setIEPSActual] = useState<any[]>([]);
    const [vat, setVATActual] = useState<any[]>([]);
    const [unit, setUnitActual] = useState<any[]>([]);
    const { currencies, isLoadingCurrency } = useCurrency('/currencies');
    const [currencyA, setCurrencyActual] = useState<any[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<ICurrencies | null>(null);
    const [companyData, setCompanyData] = useState<ICompanies[]>([])

    const [carrier, setCarrierActual] = useState<any[]>([]);
    const [charter, setCharterActual] = useState<any[]>([]);
    const [isLoadingCompanyData, setIsLoadingCompanyData] = useState(false);
    const [isLoadingProductData, setIsLoadingProductData] = useState(false);
    const [viewPDF, setViewPDF] = useState(false);
    const [isLoadingPDF, setIsLoadingPDF] = useState(false);

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    });
    const handleOrderTypeActual = (event: any) => {
        setOrderTypeActual(event.target.value);
    };

    const handleCompanyTypeActual = (event: any) => {
        setCompanyTypeActual(event.target.value);
        const filteredCompanies = companies.filter((company) => company.CompanyType_Id === event.target.value);
        setFilteredCompanies(filteredCompanies);
        setSelectedCompany('');
        setCompanyData([])
    };

    const handleCompaniesActual = async (event: React.ChangeEvent<{ value: any }>) => {

        setSelectedCompany(event.target.value);
        if (event.target.value > 0) {
            setIsLoadingCompanyData(true)
            await axios.get(`/api/companies?id=${event.target.value}`).then((result) => {
                if (result.status != 200) {
                    setIsLoadingCompanyData(false)
                    return
                }
                setCompanyData(result.data)
                setIsLoadingCompanyData(false)
                document.getElementById('Subsidiary')?.focus()
                document.getElementById('VAT')?.focus()
            })
        }

    };

    const handleSubsidiaryActual = (event: any) => {
        setSubsidiaryActual(event.target.value);
    };
    const handleProductActual = (event: React.ChangeEvent<{ value: unknown }>) => {
        setIsLoadingProductData(true)
        const selectedProductId = event.target.value as number;
        const selectedProduct = products.find((product) => product.Id === selectedProductId);
        setSelectedProduct(selectedProduct || null);
        setIsLoadingProductData(false)
    };
    const handleIEPSActual = (event: any) => {
        setIEPSActual(event.target.value);
    };
    const handleVATActual = (event: any) => {
        setVATActual(event.target.value);
    };
    const handleUnitActual = (event: any) => {
        setUnitActual(event.target.value);
    };
    // const handleCurrencyActual = (event: any) => {
    //     setCurrencyActual(event.target.value);
    // };
    const handleCurrencyActual = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedCurrencyId = event.target.value as number;
        const currency = currencies.find((c) => c.Id === selectedCurrencyId);
        setSelectedCurrency((prevSelectedCurrency) => currency || null);
    };

    // const handleCarrierActual = async (event: any) => {
    //     setCarrierActual(event.target.value);

    // };
    const handleCharterActual = (event: any) => {
        setCharterActual(event.target.value);
    };
    const [charterValue, setCharterValue] = useState('');

    const handleCarrierActual = (event) => {
        const selectedCarrierId = event.target.value;
        const charterValue = companies.find(company => company.Id === selectedCarrierId)?.Charter || '';
        setCharterValue(charterValue);
    };
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false);

    const handleRouter = (href: string) => {
        setIsLoading(true);

        router.push(href).catch(() => setIsLoading(false)).then(() => setIsLoading(false));
    }

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

    const { orders, isLoadingOrders } = useOrders(`/orders?id=${router.query.id}`)

    const order = (orders || []).map(dataRow => {

        return {
            id: dataRow.Id,
            Product: dataRow.Product,
            ConceptSale: dataRow.ConceptSale,
            Quantity: dataRow.Quantity,
            Unit: dataRow.Unit,
         
        }
    })

    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const [pdfData, setPDFData] = useState<any>();

    const onPreviewForm = async (data: any) => {
        try {
            setIsLoadingPDF(true)

            const { date, ordertype_id, companyType, name,
                subsidiary, carrier, charter, salesConcept,
                purchaseConcept, product, currency, quantity, totalBaseUnitPrice, TermsCondition } = data;
            const selectedSubsidiary = companies.find((company) => company.Id === Number(subsidiary));
            const subsidiaryValue = selectedSubsidiary ? selectedSubsidiary.Subsidiary : '';
            const selectedCarrier = companies.find((company) => company.Id === Number(carrier));
            const carrierName = selectedCarrier ? selectedCarrier.Company : '';
            const selectedCharter = companies.find((company) => company.Id === Number(charter));
            const charterName = selectedCharter ? selectedCharter.Charter : '';
            const isPreview = true

            await axios.post(`/api/orders`, {
                date, ordertype_id, companyType, name,
                subsidiary: subsidiaryValue,
                carrier: carrierName, charter: charterName,
                salesConcept, purchaseConcept, product, currency,
                quantity, totalBaseUnitPrice, isPreview
            }).then((result) => {

                if (result.status != 200) {
                    enqueueSnackbar('Ocurrio un problema en el calculo', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        },
                        style: {
                            backgroundColor: '#4CAF50',
                            color: '#FFFFFF',
                        }
                    });
                    return
                }

                const company = companies.filter(f => f.Id == Number(getValues('name')));
                const product = products.find((product) => product.Id === Number(getValues('product')));
                const currency = currencies.filter((currency) => currency.Id === Number(getValues('currency'))).map(f => f.Currency)[0];
                const quantity = getValues('quantity')
                const base = '$' + Number(result.data.calculation.base).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6 }) + ' ' + currency;
                const unitPriceBase = '$' + Number(result.data.calculation.unitBasePrice).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6 }) + ' ' + currency;
                const TotalUnitPrice = '$' + Number(getValues('totalBaseUnitPrice')).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6 }) + ' ' + currency;
                const VAT = '$' + Number(result.data.calculation.vatTotal).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6 }) + ' ' + currency;
                const IEPS = '$' + Number(result.data.calculation.IEPSTotal).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6 }) + ' ' + currency;
                const Total = '$' + Number(result.data.calculation.total).toLocaleString('en-US', { maximumFractionDigits: 6, minimumFractionDigits: 6 }) + ' ' + currency;

                setPDFData({
                    company: company, date: date,
                    product: product, quantity: quantity,
                    currency: currency, unitPriceBase: unitPriceBase,
                    totalUnitPrice: TotalUnitPrice, vat: VAT,
                    ieps: IEPS, total: Total, base: base, termsCondition: TermsCondition
                })
                setIsLoadingPDF(false)
                handlePreview()
            })
        }
        catch (err: any) {

        }
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

    const onRegisterForm = async (data: ISales) => {
        try {

            const html2pdf = require('html2pdf.js');
            var element = document.getElementById('divToPrint');
            var opt = {
                margin: 2,
                filename: `${'Orden'}-${formatmmddyySave(Date.now())}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, logging: true, dpi: 200 },
                jsPDF: { unit: 'mm', format: 'letter', orientation: 'portrait' },
                precision: 16,
                pagebreak: { after: '.html2pdf__page-break' }
            };

            await html2pdf(element, opt);

            const { date, ordertype_id, companyType, name,
                subsidiary, carrier, charter,
                salesConcept, purchaseConcept, product,
                currency, quantity, shipping, totalBaseUnitPrice, TermsCondition } = data;
            const selectedSubsidiary = companies.find((company) => company.Id === Number(subsidiary));
            const subsidiaryValue = selectedSubsidiary ? selectedSubsidiary.Subsidiary : '';
            const selectedCarrier = companies.find((company) => company.Id === Number(carrier));
            const carrierName = selectedCarrier ? selectedCarrier.Company : '';
            const selectedCharter = companies.find((company) => company.Id === Number(charter));
            const charterName = selectedCharter ? selectedCharter.Charter : '';

            await axios.post(`/api/orders`, {
                date, ordertype_id, companyType, name,
                subsidiary: subsidiaryValue, carrier: carrierName,
                charter: charterName, salesConcept, purchaseConcept,
                product, currency, quantity, shipping,
                totalBaseUnitPrice, TermsCondition
            }).then((result) => {
                if (result.data.message) {
                    enqueueSnackbar(result.data.message, {
                        variant: 'success',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        },
                        style: {
                            backgroundColor: '#4CAF50',
                            color: '#FFFFFF',
                        }
                    });
                    handlePreview()
                    handleRouter('/orders/list');
                    return;
                }

                if (result.status !== 200) {
                    enqueueSnackbar('La orden no se ha registrado correctamente', {
                        variant: 'error',
                        autoHideDuration: 3000,
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left'
                        },
                    });
                    handlePreview()
                    return;
                }


            });
        } catch (err: any) {
            console.log(err);
        }
    }

    const handlePreview = async () => {
        setViewPDF(!viewPDF)
    }
    return (
        <OrdersLayout>

            <Dialog
                sx={{ borderRadius: '12px', transition: 'all 500ms' }}
                fullScreen={false}
                open={viewPDF}
                maxWidth={'lg'}
                onClose={handlePreview}
                TransitionComponent={Slide}
                aria-labelledby="responsive-dialog-title">
                <AppBar sx={{ position: 'relative', backgroundColor: '#0C0C0C' }}>
                    <Toolbar style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
                        <Box sx={{ position: 'absolute' }}>
                            <DialogTitle id="responsive-dialog-title" sx={{ fontWeight: 500 }}>
                                <Typography id='TypographyNeutro' sx={{ fontSize: '22px', fontWeight: 500, color: 'white', alignContent: 'center', justifyContent: 'center', alignItems: 'center', display: 'flex' }} >
                                    {'Vista previa de la Orden'}
                                </Typography>
                            </DialogTitle>
                        </Box>
                        <Spacer css={{ flex: 1 }} />
                        <Tooltip placement='right' title={<Typography id='TypographyNeutro' fontSize={'12px'}>Cerrar</Typography>}>
                            <IconButton
                                edge="end"
                                color="inherit"
                                onClick={handlePreview}
                                aria-label="close">
                                <Close />
                            </IconButton>
                        </Tooltip>
                    </Toolbar>
                </AppBar>
                {
                    !isLoadingPDF && pdfData && (
                        <PreviewOrders {...pdfData} />
                    )
                }
                <DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button onClick={handleSubmit(onRegisterForm)} disabled={isSubmitting || isLoadingPDF} fullWidth type="submit" id="Button2" variant="contained">
                            {isSubmitting ? <CircularProgress color='inherit' size={25} thickness={4} /> : 'Imprimir y Guardar'}
                        </Button>
                    </DialogActions>

                </DialogContent>
            </Dialog>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'end' }}>
                <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro'
                    fontWeight={500} letterSpacing={'.2px'}>{'Cálculo de Orden'}</Typography>
                <Spacer css={{ flex: 1 }} />
                <Button id='Button2' variant="contained" disabled={isLoading}
                    onClick={() => handleRouter('/orders/list')}>
                    {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : 'Ver Listado'}
                </Button>
            </div>
            <Spacer />

            <Form onSubmit={handleSubmit(onRegisterForm)} style={{ display: 'grid', placeContent: 'center', placeItems: 'center' }}>
                <Card id='Card' >
                    <Grid container spacing={2} padding={2}>
                        <Grid container spacing={2} item xs={12}>
                            <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                                <Typography>
                                    {'Fecha de la Orden'}
                                </Typography>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <MobileDatePicker
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        InputProps={{
                                            ...register('date', {})
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                sx={{ width: "100%", fontFamily: "Archivo" }}
                                                variant="outlined"
                                                inputProps={{ style: { fontFamily: 'Archivo' } }}
                                                InputLabelProps={{ style: { fontSize: 14, fontFamily: 'Archivo' } }}
                                                {...params}
                                            />
                                        )}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                                <Typography id='Typography' sx={{ padding: .5 }}>{'Tipo de Orden *'}</Typography>
                                <TextField
                                    id='OrderType'
                                    fullWidth sx={style}
                                    variant='filled'
                                    value={ordertype[0]}
                                    InputProps={{ disableUnderline: true }}
                                    label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Tipo de Orden' + ' *'}</Typography>}
                                    select
                                    onChange={handleOrderTypeActual}
                                    defaultValue={""}
                                    inputProps={{
                                        ...register('ordertype_id', { required: 'Este campo es requerido' })
                                    }}
                                    error={!!errors.ordertype_id}
                                    helperText={errors.ordertype_id?.message}
                                    FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}
                                    SelectProps={{
                                        MenuProps:
                                        {
                                            disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                                className: 'select', sx: {
                                                    borderRadius: '8px',
                                                    boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                                }
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem key={0} value={""} style={{ margin: '.2rem', borderRadius: '8px', height: '35px' }}> </MenuItem>
                                    {
                                        orderTypes?.map((ordertypes: any) => {

                                            return (
                                                <MenuItem key={ordertypes.Id} value={ordertypes.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {ordertypes.OrderType} </MenuItem>
                                            )
                                        })
                                    }
                                </TextField>
                            </Grid>
                        </Grid>   
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
    <Typography id='Typography' sx={{ padding: .5 }}>{'Concepto (venta)'}</Typography>
    {
        isLoadingCompanyData
        ?
        <Box paddingTop={1} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
            <CircularProgress color="inherit" size={25} />
        </Box>
        :
        <TextField
            id='SalesConcept'
            fullWidth
            sx={style}
            variant='filled'
            InputProps={{ disableUnderline: true }}
            defaultValue={order[0]?.ConceptSale}
            label={<Typography id='TypographyNeutro' fontSize={'12px'}>Concepto (venta)</Typography>}
            inputProps={{
                ...register('salesConcept')
            }}
            FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
        />
    }
</Grid>
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Tipo de Empresa *'}</Typography>
                            <TextField
                                id='CompanyType'
                                fullWidth sx={style}
                                variant='filled'
                                value={companytype[0]}
                                select
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Tipo de Empresa *'}</Typography>}
                                onChange={handleCompanyTypeActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('companyType', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.companyType}
                                FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}
                                helperText={errors.companyType?.message}
                                SelectProps={{
                                    MenuProps:
                                    {
                                        disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                            className: 'select', sx: {
                                                borderRadius: '8px',
                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem key={0} value={""} style={{ margin: '.2rem', borderRadius: '8px', height: '35px' }}> </MenuItem>
                                {
                                    companyTypes?.map((companytypes: any) => {

                                        return (
                                            <MenuItem key={companytypes.Id} value={companytypes.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {companytypes.CompanyType} </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Nombre *'}</Typography>
                            <TextField
                                id='CompanyName'
                                fullWidth sx={style}
                                variant='filled'
                                value={selectedCompany}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Cliente *'}</Typography>}
                                select
                                onChange={handleCompaniesActual}
                                FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}
                                inputProps={{
                                    ...register('name', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.name}
                                helperText={errors.name?.message}
                                SelectProps={{
                                    MenuProps:
                                    {
                                        disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                            className: 'select', sx: {
                                                borderRadius: '8px',
                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem key={0} value={""} style={{ margin: '.2rem', borderRadius: '8px', height: '35px' }}> </MenuItem>
                                {
                                    filteredCompanies.map((company: any) => (
                                        <MenuItem key={company.Id} value={company.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}>
                                            {company.Company}
                                        </MenuItem>
                                    ))
                                }
                            </TextField>
                        </Grid>
                   

                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={4}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Transportista'}</Typography>
                            <TextField
                                id='Carrier'
                                fullWidth sx={style}
                                variant='filled'
                                value={carrier[0]}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Transportista'}</Typography>}
                                select
                                onChange={handleCarrierActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('carrier')
                                }}
                                FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}
                              
                                SelectProps={{
                                    MenuProps:
                                    {
                                        disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                            className: 'select', sx: {
                                                borderRadius: '8px',
                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem key={0} value={""} style={{ margin: '.2rem', borderRadius: '8px', height: '35px' }}> </MenuItem>
                                {
                                    companies?.map((companiesArray: any) => {

                                        return (
                                            <MenuItem key={companiesArray.Id} value={companiesArray.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {companiesArray.Company} </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={4}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Permiso/Flete'}</Typography>

                                <TextField
                                        id='Charter'
                                        fullWidth
                                        sx={style}
                                        variant='filled'
                                        value={charterValue}
                                        inputProps={{
                                            ...register('charter')
                                        }}
                                        error={!!errors.charter}
                                        InputProps={{ disableUnderline: true }}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Permiso/Flete</Typography>}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                    />
                        </Grid>
                        {/*


                        <Grid item xs={12} lg={4}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Concepto (venta) *'}</Typography>
                            <TextField id='SalesConcept' fullWidth sx={style} variant='filled'
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Concepto (Orden de Venta)</Typography>}
                                inputProps={{
                                    ...register('salesConcept', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.salesConcept}
                                helperText={errors.salesConcept?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} lg={4}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Concepto (Compra) *'}</Typography>
                            <TextField id='PurchaseConcept' fullWidth sx={style}
                                variant='filled' type='text'
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Concepto (Orden de Compra) </Typography>}
                                inputProps={{
                                    ...register('purchaseConcept', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.purchaseConcept}
                                helperText={errors.purchaseConcept?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            />
                        </Grid>*/

                        }
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={4}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Flete'} </Typography>
                            <TextField id='shipping' fullWidth sx={style}
                                InputProps={{
                                    disableUnderline: true,
                                    inputProps: {
                                        maxLength: 100,
                                        type: 'number',
                                        step: '0.01',  // Permite decimales con dos dígitos
                                    }
                                }}
                                variant='filled' type='text'
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Flete</Typography>}
                                {...register('shipping')}
                           
                            // helperText={errors.Town?.message}
                            />
                        </Grid>
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Producto *'}</Typography>
                            <TextField
                                id='Product'
                                fullWidth sx={style}
                                variant='filled'
                                value={productActual[0]}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Producto *'}</Typography>}
                                select
                                onChange={handleProductActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('product', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.product}
                                helperText={errors.product?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}
                                SelectProps={{
                                    MenuProps:
                                    {
                                        disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                            className: 'select', sx: {
                                                borderRadius: '8px',
                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem key={0} value={""} style={{ margin: '.2rem', borderRadius: '8px', height: '35px' }}> </MenuItem>
                                {
                                    products?.map((productsArray: any) => {

                                        return (
                                            <MenuItem key={productsArray.Id} value={productsArray.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {productsArray.Product} </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'VAT %'}</Typography>

                            {
                                isLoadingCompanyData
                                    ?
                                    <Box paddingTop={1} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                                        <CircularProgress color="inherit" size={25} />
                                    </Box>

                                    :
                                    <TextField
                                        id='VAT'
                                        fullWidth
                                        sx={style}
                                        variant='filled'
                                        value={selectedCompany == '' ? '' : companyData[0]?.VAT}
                                        inputProps={{
                                            ...register('vatPercentage', {})
                                        }}
                                        error={!!errors.vatPercentage}
                                        InputProps={{ disableUnderline: true }}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>VAT</Typography>}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                    />
                            }
                        </Grid>
                        
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'IEPS'}</Typography>
                            {
                                isLoadingProductData
                                    ?
                                    <Box paddingTop={1} display={'flex'} justifyContent={'center'} alignItems={'center'} alignContent={'center'}>
                                        <CircularProgress color="inherit" size={25} />
                                    </Box>
                                    :
                                    <TextField
                                        id='IEPS'
                                        fullWidth
                                        sx={style}
                                        variant='filled'
                                        inputProps={{
                                            ...register('iepsPercentage', {})
                                        }}
                                        error={!!errors.iepsPercentage}
                                        InputProps={{ disableUnderline: true }}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>IEPS</Typography>}
                                        value={selectedProduct ? selectedProduct.IEPS : ''}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                    />}
                        </Grid>

                                   <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Cantidad *'} </Typography>
                            <TextField id='Quantity' fullWidth sx={style} variant='filled'
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Cantidad</Typography>}
                                InputProps={{
                                    disableUnderline: true,
                                    inputProps: {
                                        maxLength: 100,
                                        type: 'number',
                                    }
                                }}
                                {...register('quantity', { required: 'Este campo es requerido' })}
                                error={!!errors.quantity}
                                helperText={errors.quantity?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            />
                        </Grid>

                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Moneda *'}</Typography>
                            <TextField
                                id='Currency'
                                fullWidth sx={style}
                                variant='filled'
                                value={currencyA[0]}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Moneda *'}</Typography>}
                                select
                                onChange={handleCurrencyActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('currency', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.currency}
                                helperText={errors.currency?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}

                                SelectProps={{
                                    MenuProps:
                                    {
                                        disableScrollLock: false, TransitionProps: { timeout: 0 }, PaperProps: {
                                            className: 'select', sx: {
                                                borderRadius: '8px',
                                                boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                            }
                                        }
                                    }
                                }}
                            >
                                <MenuItem key={0} value={""} style={{ margin: '.2rem', borderRadius: '8px', height: '35px' }}> </MenuItem>
                                {
                                    currencies?.map((currenciesArray: any) => {

                                        return (
                                            <MenuItem key={currenciesArray.Id} value={currenciesArray.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {currenciesArray.Currency} </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
             
                        <Grid item xs={12} lg={windowDimensions.width < 1500 ? 4 : 2} md={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Precio Unitario *'} </Typography>
                            <TextField id='TotalBaseUnit' fullWidth sx={style} variant='filled'
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Precio Unitario *</Typography>}

                                InputProps={{
                                    disableUnderline: true,
                                    inputProps: {
                                        maxLength: 3,
                                        type: 'number',
                                        step: '0.01',  // Permite decimales con dos dígitos
                                    }
                                }}
                                {...register('totalBaseUnitPrice', { required: 'Este campo es requerido' })}
                                error={!!errors.totalBaseUnitPrice}
                                helperText={errors.totalBaseUnitPrice?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} ><Divider /></Grid>
                        <Grid item xs={12} >
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Terminos y Condiciones'} </Typography>
                            <TextField
                                variant='filled' sx={style}
                                fullWidth
                                {...register('TermsCondition', { required: false })}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Terminos y Condiciones'}</Typography>}
                                InputProps={{
                                    disableUnderline: true,
                                    inputProps: {
                                        maxLength: 500
                                    }
                                }}
                                multiline />
                        </Grid>
                    </Grid>
                </Card>
                <Button type="button" id="Button2" variant="contained" fullWidth sx={{ margin: 1 }} onClick={handleSubmit(onPreviewForm)}>
                    {isLoadingPDF ? <CircularProgress color='inherit' size={25} thickness={4} /> : (pdfData ? 'Volver a Calcular y Previsualizar' : 'Calcular y Previsualizar')}
                </Button>

            </Form>

        </OrdersLayout>


    );
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
