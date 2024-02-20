import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { useRouter } from "next/router";
import { EntityLayout, Layout } from "../../../components/layouts";
import { OutlinedInputProps, Select, InputLabel, SelectChangeEvent, Alert, AlertTitle, Button, Card, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Slide, TextField, Typography, alpha, createTheme } from "@mui/material";
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

export default function SalesRegister(props: any) {
    // const { registerSale } = useContext(SalesContext);

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ISales>();

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
    const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
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

    const [carrier, setCarrierActual] = useState<any[]>([]);
    const [charter, setCharterActual] = useState<any[]>([]);

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
    // const handleCompanyTypeActual = (event: any) => {
    //     setCompanyTypeActual(event.target.value);
    // };

    // const handleCompaniesActual = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     const selectedCompanyId = event.target.value as number;
    //     const selectedCompany = companies.find((company) => company.Id === selectedCompanyId);
    //     setSelectedCompany(selectedCompany || null);
    // };
    const handleCompanyTypeActual = (event: any) => {
        setCompanyTypeActual(event.target.value);
        const filteredCompanies = companies.filter((company) => company.CompanyType_Id === event.target.value);
        setFilteredCompanies(filteredCompanies);
        setSelectedCompany(null);
    };

    const handleCompaniesActual = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedCompanyId = event.target.value as number;
        const selectedCompany = companies.find((company) => company.Id === selectedCompanyId);
        setSelectedCompany(selectedCompany || null);
    };
    const handleSubsidiaryActual = (event: any) => {
        setSubsidiaryActual(event.target.value);
    };
    const handleProductActual = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedProductId = event.target.value as number;
        const selectedProduct = products.find((product) => product.Id === selectedProductId);
        setSelectedProduct(selectedProduct || null);
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
    const handleCarrierActual = (event: any) => {
        setCarrierActual(event.target.value);
    };
    const handleCharterActual = (event: any) => {
        setCharterActual(event.target.value);
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

    const [selectedDate, setSelectedDate] = useState(new Date());
    const handleDateChange = (date) => {
        console.log('Selected Date:', date);

        setSelectedDate(date);
    };

    const onRegisterForm = async (data: ISales) => {
        try {
            const { date, ordertype_id, companyType, name, subsidiary, carrier, charter, salesConcept, purchaseConcept, product, currency, quantity, shipping, totalBaseUnitPrice } = data;
            const selectedSubsidiary = companies.find((company) => company.Id === Number(subsidiary));
            const subsidiaryValue = selectedSubsidiary ? selectedSubsidiary.Subsidiary : '';
            const selectedCarrier = companies.find((company) => company.Id === Number(carrier));
            const carrierName = selectedCarrier ? selectedCarrier.Company : '';
            const selectedCharter = companies.find((company) => company.Id === Number(charter));
            const charterName = selectedCharter ? selectedCharter.Charter : '';

            await axios.post(`/api/sales`, {
                date, ordertype_id, companyType, name, subsidiary: subsidiaryValue, carrier: carrierName, charter: charterName, salesConcept, purchaseConcept, product, currency, quantity, shipping, totalBaseUnitPrice
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
                    handleRouter('/sales/list');
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
                    return;
                }


            });
        } catch (err: any) {
            console.log(err);
        }
    }
    return (
        <EntityLayout>
            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'end' }}>
                <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro'
                    fontWeight={500} letterSpacing={'.2px'}>{'Cálculo de Orden'}</Typography>
                <Spacer css={{ flex: 1 }} />
                <Button id='Button2' variant="contained" disabled={isLoading}
                    onClick={() => handleRouter('/sales/list')}>
                    {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : 'Ver Listado'}
                </Button>
            </div>
            <Spacer />

            <Form onSubmit={handleSubmit(onRegisterForm)} style={{ display: 'grid', placeContent: 'center', placeItems: 'center' }}>
                <Card id='Card' >
                    <Grid container spacing={4} padding={2}>

                        <Grid item xs={12} lg={3}>
                            <Typography>
                                {'Fecha'}
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
                                            sx={{ width: "100%", fontFamily:"Archivo" }}
                                            variant="outlined"
                                            inputProps={{style:{fontFamily:'Archivo'}}}
                                            InputLabelProps={{ style: { fontSize: 14, fontFamily: 'Archivo' } }}
                                            {...params}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={12} lg={3}>
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
                        <Grid item xs={12} lg={3}>
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
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Nombre *'}</Typography>
                            <TextField
                                id='CompanyName'
                                fullWidth sx={style}
                                variant='filled'
                                value={selectedCompany ? selectedCompany.Id : ''}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Cliente *'}</Typography>}
                                select
                                onChange={handleCompaniesActual}
                                defaultValue={""}
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
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Sucursal *'}</Typography>
                            <TextField
                                id='Subsidiary'
                                fullWidth sx={style}
                                variant='filled'
                                value={companiesA[0]}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Sucursal *'}</Typography>}
                                select
                                onChange={handleSubsidiaryActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('subsidiary', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.subsidiary}
                                helperText={errors.subsidiary?.message}
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
                                            <MenuItem key={companiesArray.Id} value={companiesArray.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {companiesArray.Subsidiary} </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Transportista *'}</Typography>
                            <TextField
                                id='Carrier'
                                fullWidth sx={style}
                                variant='filled'
                                value={carrier[0]}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Transportista *'}</Typography>}
                                select
                                onChange={handleCarrierActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('carrier', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.carrier}
                                FormHelperTextProps={{ sx: { fontFamily: 'Nunito Sans' } }}
                                helperText={errors.carrier?.message}
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
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Permiso/Flete *'}</Typography>
                            <TextField
                                id='Charter'
                                fullWidth sx={style}
                                variant='filled'
                                value={charter[0]}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>{'Seleccionar Permiso/Flete *'}</Typography>}
                                select
                                onChange={handleCharterActual}
                                defaultValue={""}
                                inputProps={{
                                    ...register('charter', { required: 'Este campo es requerido' })
                                }}
                                error={!!errors.charter}
                                helperText={errors.charter?.message}
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
                                            <MenuItem key={companiesArray.Id} value={companiesArray.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Nunito Sans', fontWeight: 500, fontSize: '14px' }}> {companiesArray.Charter} </MenuItem>
                                        )
                                    })
                                }
                            </TextField>
                        </Grid>
                        <Grid item xs={12} lg={3}>
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
                        <Grid item xs={12} lg={3}>
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
                        </Grid>
                        <Grid item xs={12} lg={3}>
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

                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'IEPS *'}</Typography>
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
                            />
                        </Grid>

                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'VAT %'}</Typography>
                            <TextField
                                id='VAT'
                                fullWidth
                                sx={style}
                                variant='filled'
                                inputProps={{
                                    ...register('vatPercentage', {})
                                }}
                                error={!!errors.vatPercentage}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>VAT</Typography>}
                                value={selectedCompany ? selectedCompany.VAT : ''}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Unidad de Medida *'}</Typography>
                            <TextField
                                id='Unit'
                                fullWidth
                                sx={style}
                                variant='filled'
                                inputProps={{
                                    ...register('unit', {})
                                }}
                                // error={!!errors.unit}
                                // helperText={errors.unit?.message}
                                InputProps={{ disableUnderline: true }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Unidad de Medida</Typography>}
                                value={selectedProduct ? selectedProduct.Unit : ''}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            />
                        </Grid>
                        <Grid item xs={12} lg={3}>
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
                        {/* <Grid item xs={12} lg={3}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'Cantidad'} *</Typography>
                <TextField id='Quantity' fullWidth sx={style}
                       InputProps={{ 
                        disableUnderline: true,
                        inputProps: {
                            maxLength: 100,
                            type: 'number', 
                            step: '0.01',  // Permite decimales con dos dígitos
                        }
                    }}
                    variant='filled' type='text'
                    label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Cantidad</Typography>}
                    inputProps={{
                        ...register('quantity', { required: 'Este campo es requerido'  })
                    }}
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                />
            </Grid> */}
                        <Grid item xs={12} lg={3}>
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
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Flete'} *</Typography>
                            <TextField id='Shipping' fullWidth sx={style}
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
                                {...register('shipping', { required: 'Este campo es requerido' })}
                                error={!!errors.shipping}
                                helperText={errors.shipping?.message}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                            // helperText={errors.Town?.message}
                            />
                        </Grid>
                        {/* <Grid item xs={12} lg={3}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'Costo Flete'} *</Typography>
                <TextField id='ShippingCost' fullWidth sx={style} variant='filled'
                       InputProps={{ 
                        disableUnderline: true,
                        inputProps: {
                            maxLength: 100,
                            type: 'number', 
                        }
                    }}
                    {...register('shippingCost', { required: 'x' })}
                    error={!!errors.shippingCost}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={errors.Carrier?.message}
                />
            </Grid> */}
                        <Grid item xs={12} lg={3}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{'Total Base Unitario'} </Typography>
                            <TextField id='TotalBaseUnit' fullWidth sx={style} variant='filled'
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Total Base Unitario</Typography>}

                                InputProps={{
                                    disableUnderline: true,
                                    inputProps: {
                                        maxLength: 100,
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
                        {/* <Grid item xs={12} lg={3}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'VAT %'}</Typography>
                <TextField id='VATResult' fullWidth sx={style} variant='filled'
                    InputProps={{ 
                        disableUnderline: true,
                        inputProps: {
                            maxLength: 100,
                            type: 'number', 
                        }
                    }}
                    // {...register('')}
                    // error={!!errors.}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={errors.?.message}
                />
            </Grid> */}
                        {/* <Grid item xs={12} lg={3}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'IEPS %'}</Typography>
                <TextField id='IEPSResult' fullWidth sx={style}
                 InputProps={{ 
                    disableUnderline: true,
                    inputProps: {
                        maxLength: 100,
                        type: 'number', 
                    }
                }}
                    variant='filled' type='text'
                    // {...register('')}
                    // error={!!errors.}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={errors.LegalProxy?.message}
                />
            </Grid> */}
                        {/* <Grid item xs={12} lg={3}>
                <Typography id='Typography' sx={{ padding: .5 }}>{'Total Precio Unit.'} *</Typography>
                <TextField id='TotalUnit' fullWidth sx={style}
                       InputProps={{ 
                        disableUnderline: true,
                        inputProps: {
                            maxLength: 100,
                            type: 'number', 
                        }
                    }}
                    variant='filled' type='text'
                    // {...register('', { })}
                    // error={!!errors.}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={?.message}
                />
            </Grid> */}
                        {/*           
            <Grid item xs={12} lg={3}>
            <Typography id='Typography' sx={{ padding: .5 }}>{'Base'} *</Typography>
                <TextField id='Base' fullWidth sx={style}
                    InputProps={{ 
                        disableUnderline: true,
                        inputProps: {
                            maxLength: 100,
                            type: 'number', 
                        }
                    }}
                    variant='filled' type='text'
                    // {...register('', { required: Carriers.required })}
                    // error={!!errors.}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={errors.?.message}
                />
            </Grid> */}
                        {/* <Grid item xs={12} lg={3}>
                                <Typography id='Typography' sx={{ padding: .5 }}>{'VAT %'} </Typography>
                <TextField id='VATBase' fullWidth sx={style}
                     InputProps={{ 
                        disableUnderline: true,
                        inputProps: {
                            maxLength: 100,
                            type: 'number', 
                        }
                    }}
                    variant='filled' type='text'
                    // {...register('', { required: Carriers.required })}
                    // error={!!errors.}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={errors.?.message}
                />
            </Grid> */}
                        {/* <Grid item xs={12} lg={3}>
                                <Typography id='Typography' sx={{ padding: .5 }}>{'Total'} </Typography>
                <TextField id='Total' fullWidth sx={style}
                   InputProps={{ 
                    disableUnderline: true,
                    inputProps: {
                        maxLength: 100,
                        type: 'number', 
                    }
                }}
                    variant='filled' type='text'
                    // {...register('', { required: Carriers.required })}
                    // error={!!errors.}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    // helperText={errors.Town?.message}
                />
            </Grid> */}
                    </Grid>
                </Card>
                <Button disabled={isSubmitting} type="submit" id="Button2" variant="contained" fullWidth sx={{ margin: 1 }}>
                    {isSubmitting ? <CircularProgress color='inherit' size={25} thickness={4} /> : 'Calcular y Guardar'}
                </Button>
            </Form>

        </EntityLayout>


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
