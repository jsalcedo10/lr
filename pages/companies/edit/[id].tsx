import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { useRouter } from "next/router";
import { EntityLayout, Layout } from "../../../components/layouts";
import { Alert, AlertTitle, Button, Card, CircularProgress, Grid, MenuItem, Slide, TextField, Typography, alpha, createTheme } from "@mui/material";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Spacer, Text } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CheckCircleRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { useCompanies } from "../../../hooks/useCompanies";
import { ICompanies } from "../../../interfaces/companies";
import { useCompanyTypes } from "../../../hooks/useCompanyTypes";

export default function CompaniesEdit(props: any) {

    const router = useRouter();

    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }, getValues, trigger, reset, setValue } = useForm<ICompanies>();

    const { Companies } = props;

    const { companies, isLoadingCompanies } = useCompanies(`/companies?id=${router.query.id}`)
    const { companyTypes, isLoadingCompanyTypes } = useCompanyTypes(`/companytypes`)

    const company = (companies || []).map(dataRow => {
        return {
            id: dataRow.Id,
            Company: dataRow.Company,
            RFC: dataRow.RFC,
            Subsidiary: dataRow.Subsidiary,
            Turn: dataRow.Turn,
            LegalProxy: dataRow.LegalProxy,
            State: dataRow.State,
            Town: dataRow.Town,
            Address: dataRow.Address,
            Type: dataRow.Type,
            Charter: dataRow.Charter,
            Zone: dataRow.Zone,
            VAT: dataRow.VAT,
            CompanyType_Id: dataRow.CompanyType_Id,
            TaxRegime: dataRow.TaxRegime,
            Phone: dataRow.Phone
        }
    })

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

    const { enqueueSnackbar } = useSnackbar();

    const [isLoading, setIsLoading] = useState(false)

    const handleRouter = (href: string) => {

        setIsLoading(true)

        router.push(href).catch(() => setIsLoading(false)).then(() => setIsLoading(false))
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

    const style2 = {
        '& .MuiFilledInput-root': {
            border: '1px solid #e2e2e1',
            fontFamily: 'Archivo', fontWeight: 400, fontSize: '16px',
            overflow: 'hidden',
            borderRadius: '3px',
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

    const [states, setStates] = useState<any[]>([])

    useEffect(() => {
        axios.get('https://countriesnow.space/api/v0.1/countries/states').then((response) => { setStates(response.data.data) });
    }, [])

    const onRegisterForm = async (data: ICompanies) => {

        try {
            if (data == undefined) {
                return
            }

            const id = company[0]?.id

            let { Company, RFC, Subsidiary,
                LegalProxy, State, Town, Address,
                Type, Charter, Zone, VAT, Turn,
                CompanyType_Id, Phone, TaxRegime } = data;

            VAT = Number(VAT)

            await axios.put(`/api/companies`, {
                id, Company, RFC, Subsidiary,
                LegalProxy, State, Town, Address,
                Type, Charter, Zone, VAT, Turn,
                CompanyType_Id, Phone, TaxRegime
            }).then((result) => {

                if (result.status != 200) {
                    return
                }
                enqueueSnackbar('La empresa ha sido actualizada correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleRouter(`/companies/list`)
                return;


            })
        }
        catch (err: any) {
            console.log(err)
        }
    }

    const [numberval, setnumberval] = useState(company[0]?.VAT)

    useEffect(() => {
        insertNumbers()
    }, [companies])

    const insertNumbers = () => {
        setnumberval(company[0]?.VAT)
        document.getElementById('VAT')?.focus()
    }

    const handleNumberVale = (event: any) => {
        const re = /^\d{1,}(\.\d{0,8})?$/;
        if (event.target.value === '' || re.test(event.target.value)) {
            setnumberval(event.target.value)
        }
    }

    return (

        <EntityLayout>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'end' }}>
                <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro'
                    fontWeight={500} letterSpacing={'.2px'}>{Companies.EditCompany}</Typography>
                <Spacer css={{ flex: 1 }} />
                <Button id='Button2' variant="contained" disabled={isLoading}
                    onClick={() => handleRouter('/companies/list')}>
                    {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : Companies.ViewList}
                </Button>
            </div>
            <Spacer />
            {
                isLoadingCompanies || isLoadingCompanyTypes
                    ?
                    <div style={{ display: 'grid', placeContent: 'center', placeItems: 'center', height: '55vh', width: '100%' }}>
                        <CircularProgress sx={{ color: '#393939' }} size={windowDimensions.width > 1900 ? 70 : 50} thickness={4} />
                    </div>
                    :

                    <Form onSubmit={handleSubmit(onRegisterForm)} style={{ display: 'grid', placeContent: 'center', placeItems: 'center' }}>
                        <Card id='Card' >
                            <Grid container spacing={4} padding={2}>
                                <Grid item xs={12} lg={6} >
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.CompanyType} *</Typography>
                                    <TextField select id='CompanyType_Id' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 50 }}
                                        variant='filled'
                                        defaultValue={company[0]?.CompanyType_Id}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Tipo de Empresa</Typography>}
                                        {...register('CompanyType_Id', { required: Companies.required })}
                                        error={!!errors.CompanyType_Id}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.CompanyType_Id?.message}
                                        SelectProps={{
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
                                        }}
                                    >
                                        <MenuItem key={0} value="" style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 500, fontSize: '14px' }}> </MenuItem>
                                        {companyTypes?.map((companytype: any) => {
                                            return (
                                                <MenuItem key={companytype.Id} value={companytype.Id} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 400, letterSpacing: '.8x', fontSize: '15px' }}> {companytype.CompanyType} </MenuItem>
                                            )
                                        })}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Name} *</Typography>
                                    <TextField id='Company' fullWidth sx={style} variant='filled'
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 100 }}
                                        defaultValue={company[0]?.Company}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Nombre</Typography>}
                                        {...register('Company', { required: Companies.required })}
                                        error={!!errors.Company}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Company?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.RFC} *</Typography>
                                    <TextField id='RFC' fullWidth sx={style} variant='filled'
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 50 }}
                                        defaultValue={company[0]?.RFC}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese RFC</Typography>}
                                        {...register('RFC', { required: Companies.required })}
                                        error={!!errors.RFC}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.RFC?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Subsidiary}</Typography>
                                    <TextField id='Subsidiary' fullWidth sx={style} variant='filled'
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 100 }}
                                        defaultValue={company[0]?.Subsidiary}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Sucursal</Typography>}
                                        {...register('Subsidiary')}
                                        error={!!errors.Subsidiary}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Subsidiary?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.LegalProxy}</Typography>
                                    <TextField id='LegalProxy' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 100 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.LegalProxy}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Representante Legal</Typography>}
                                        {...register('LegalProxy')}
                                        error={!!errors.LegalProxy}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.LegalProxy?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Turn} *</Typography>
                                    <TextField id='Turn' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 50 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.Turn}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Giro</Typography>}
                                        {...register('Turn', { required: Companies.required })}
                                        error={!!errors.Turn}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Turn?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6} >
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.State} *</Typography>
                                    <TextField select id='State' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 50 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.State}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Estado</Typography>}
                                        {...register('State', { required: Companies.required })}
                                        error={!!errors.State}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.State?.message}
                                        SelectProps={{
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
                                                        height: 300,
                                                        boxShadow: 'rgba(0,0,0,0.2) 0px 0px 15px 0px'
                                                    }
                                                }
                                            }
                                        }}
                                    >
                                        <MenuItem key={0} value="" style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 500, fontSize: '14px' }}> </MenuItem>
                                        {states.length == 0
                                            ?
                                            <div style={{ height: 150, display: 'grid', placeContent: 'center', placeItems: 'center' }}>
                                                <CircularProgress color='inherit' size={40} /></div>
                                            :
                                            states?.filter(f => f.name == 'Mexico').map((state: any) => {
                                                return (
                                                    state.states.map((st: any) => {
                                                        return (

                                                            <MenuItem key={st.name} value={st.name} style={{ margin: '.2rem', borderRadius: '8px', height: '35px', fontFamily: 'Archivo', fontWeight: 400, letterSpacing: '.8x', fontSize: '15px' }}> {st.name} </MenuItem>
                                                        )
                                                    }
                                                    )
                                                )
                                            })
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Town} *</Typography>
                                    <TextField id='Town' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 50 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.Town}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Municipio</Typography>}
                                        {...register('Town', { required: Companies.required })}
                                        error={!!errors.Town}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Town?.message}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Address} *</Typography>
                                    <TextField id='Address' fullWidth sx={style2} multiline
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 200 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.Address}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Dirección</Typography>}
                                        {...register('Address', { required: Companies.required })}
                                        error={!!errors.Address}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Address?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>Telefono *</Typography>
                                    <TextField id='Phone' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 100 }}
                                        variant='filled' type='number'
                                        defaultValue={company[0]?.Phone}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Telefono</Typography>}
                                        {...register('Phone', { required: Companies.required })}
                                        error={!!errors.Phone}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Phone?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>Régimen Fiscal *</Typography>
                                    <TextField id='TaxRegime' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 100 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.TaxRegime}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Régimen Fiscal</Typography>}
                                        {...register('TaxRegime', { required: Companies.required })}
                                        error={!!errors.TaxRegime}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.TaxRegime?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Type} *</Typography>
                                    <TextField id='Type' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 45 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.Type}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Tipo</Typography>}
                                        {...register('Type', { required: Companies.required })}
                                        error={!!errors.Type}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Type?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Charter} *</Typography>
                                    <TextField id='Charter' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 60 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.Charter}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Permiso/Flete</Typography>}
                                        {...register('Charter', { required: Companies.required })}
                                        error={!!errors.Charter}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Charter?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.Zone}</Typography>
                                    <TextField id='Zone' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true }}
                                        inputProps={{ maxLength: 50 }}
                                        variant='filled' type='text'
                                        defaultValue={company[0]?.Zone}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Zona</Typography>}
                                        {...register('Zone')}
                                        error={!!errors.Zone}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.Zone?.message}
                                    />
                                </Grid>
                                <Grid item xs={12} lg={6}>
                                    <Typography id='Typography' sx={{ padding: .5 }}>{Companies.VAT}</Typography>
                                    <TextField id='VAT' fullWidth sx={style}
                                        InputProps={{ disableUnderline: true, endAdornment: <Typography id='Typography' color={'grey'} paddingTop={1.8}>%</Typography> }}
                                        variant='filled' type='text'
                                        value={numberval}
                                        label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese VAT</Typography>}
                                        {...register('VAT', { onChange: handleNumberVale })}
                                        error={!!errors.VAT}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        helperText={errors.VAT?.message}
                                    />
                                </Grid>
                            </Grid>
                        </Card>
                        <Button disabled={isSubmitting} type="submit" id="Button2" variant="contained" fullWidth sx={{ margin: 1 }}>
                            {isSubmitting ? <CircularProgress color='inherit' size={25} thickness={4} /> : Companies.Edit}
                        </Button>
                    </Form>
            }
        </EntityLayout>
    )
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
        props: { Companies: response.default.Companies }
    }
}