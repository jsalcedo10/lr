import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { useRouter } from "next/router";
import { EntityLayout, Layout } from "../../../components/layouts";
import { Alert, AlertTitle, Button, Card, CircularProgress, Grid, Slide, TextField, Typography, alpha, createTheme } from "@mui/material";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Spacer, Text } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import { IProduct } from "../../../interfaces/products";
import axios from "axios";
import { CheckCircleRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";

export default function ProductRegister(props: any) {

    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }, getValues, trigger, reset, setValue } = useForm<IProduct>();

    const { Products } = props;

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

    const router = useRouter();
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


    const onRegisterForm = async (data: IProduct) => {

        try {
            if (data == undefined) {
                return
            }

            let { Product, Description, Type, Unit, Octane, IEPS } = data;

            Octane = Number(Octane)
            IEPS = Number(IEPS)

            await axios.post(`/api/products`, { Product, Description, Type, Unit, Octane, IEPS }).then((result) => {

                if (result.status != 200) {
                    return
                }
                enqueueSnackbar('El producto ha sido guardado correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleRouter(`/products/list`)
                return;


            })
        }
        catch (err: any) {
            console.log(err)
        }
    }

    const [octane, setoctane] = useState('')
    const [ieps, setieps] = useState('')

    const handleNumberVale = (event: any, type: number) => {
        //type 1 = unidad
        //type 2 = tipo 
        //type 3 = ieps
        const re = /^\d{1,}(\.\d{0,8})?$/;

        if (event.target.value === '' && type === 2 || re.test(event.target.value) && type === 2) {
            setoctane(event.target.value)
        }
        if (event.target.value === '' && type === 3 || re.test(event.target.value) && type === 3) {
            setieps(event.target.value)
        }
    }

    return (
        <EntityLayout>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'end' }}>
                <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro'
                    fontWeight={500} letterSpacing={'.2px'}>{Products.RegisterProduct}</Typography>
                <Spacer css={{ flex: 1 }} />
                <Button id='Button2' variant="contained" disabled={isLoading}
                    onClick={() => handleRouter('/products/list')}>
                    {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : Products.ViewList}
                </Button>
            </div>
            <Spacer />

            <Form onSubmit={handleSubmit(onRegisterForm)} style={{ display: 'grid', placeContent: 'center', placeItems: 'center' }}>
                <Card id='Card' >
                    <Grid container spacing={4} padding={2}>
                        <Grid item xs={12} lg={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{Products.Product} *</Typography>
                            <TextField id='Product' fullWidth sx={style} variant='filled'
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Producto</Typography>}
                                InputProps={{ disableUnderline: true }}
                                inputProps={{ maxLength: 100 }}
                                {...register('Product', { required: Products.required })}
                                error={!!errors.Product}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.Product?.message}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{Products.Description} *</Typography>
                            <TextField id='Description' fullWidth sx={style} variant='filled'
                                InputProps={{ disableUnderline: true }}
                                inputProps={{ maxLength: 250 }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Descrpición</Typography>}
                                {...register('Description', { required: Products.required })}
                                error={!!errors.Description}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.Description?.message}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{Products.Type} *</Typography>
                            <TextField id='Type' fullWidth sx={style} variant='filled'
                                InputProps={{ disableUnderline: true }}
                                inputProps={{ maxLength: 45 }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Tipo</Typography>}
                                {...register('Type', { required: Products.required })}
                                error={!!errors.Type}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.Type?.message}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{Products.Unit} *</Typography>
                            <TextField id='Unit' fullWidth sx={style}
                                InputProps={{ disableUnderline: true }}
                                variant='filled' type='text'
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Unidad de Medida</Typography>}
                                {...register('Unit', { required: Products.required })}
                                error={!!errors.Unit}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.Unit?.message}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{Products.Octane} *</Typography>
                            <TextField id='Octane' fullWidth sx={style}
                                InputProps={{ disableUnderline: true }}
                                variant='filled' type='text'
                                value={octane}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Octanaje</Typography>}
                                {...register('Octane', { required: Products.required, onChange: (event) => handleNumberVale(event, 2) })}
                                error={!!errors.Octane}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.Octane?.message}
                            />
                        </Grid>
                        <Grid item xs={12} lg={6}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{Products.IEPS} *</Typography>
                            <TextField id='IEPS' fullWidth sx={style}
                                InputProps={{ disableUnderline: true, endAdornment: <Typography id='Typography' color={'grey'} paddingTop={1.8}>%</Typography> }}
                                variant='filled' type='text'
                                value={ieps}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese IEPS</Typography>}
                                {...register('IEPS', { required: Products.required, onChange: (event) => handleNumberVale(event, 3) })}
                                error={!!errors.IEPS}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.IEPS?.message}
                            />
                        </Grid>
                    </Grid>
                </Card>
                <Button disabled={isSubmitting} type="submit" id="Button2" variant="contained" fullWidth sx={{ margin: 1 }}>
                    {isSubmitting ? <CircularProgress color='inherit' size={25} thickness={4} /> : Products.Register}
                </Button>
            </Form>

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
        props: { Products: response.default.Products }
    }
}