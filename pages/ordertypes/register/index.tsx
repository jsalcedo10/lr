import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { useRouter } from "next/router";
import { EntityLayout, Layout } from "../../../components/layouts";
import { Alert, AlertTitle, Button, Card, CircularProgress, Grid, Slide, TextField, Typography, alpha, createTheme } from "@mui/material";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Spacer, Text } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { CheckCircleRounded } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { IOrderTypes } from "../../../interfaces/ordertypes";

export default function OrderTypesRegister(props: any) {

    const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }, getValues, trigger, reset, setValue } = useForm<IOrderTypes>();

    const { OrderTypes } = props;

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


    const onRegisterForm = async (data: IOrderTypes) => {

        try {
            if (data == undefined) {
                return
            }

            const { OrderType } = data;

            await axios.post(`/api/ordertypes`, { OrderType }).then((result) => {

                if (result.status != 200) {
                    return
                }
                enqueueSnackbar('El tipo de orden ha sido guardado correctamente', {
                    variant: 'success',
                    autoHideDuration: 3000,
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left'
                    }
                })
                handleRouter(`/ordertypes/list`)
                return;


            })
        }
        catch (err: any) {
            console.log(err)
        }
    }

    return (
        <EntityLayout>

            <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'end' }}>
                <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro'
                    fontWeight={500} letterSpacing={'.2px'}>{OrderTypes.RegisterOrderType}</Typography>
                <Spacer css={{ flex: 1 }} />
                <Button id='Button2' variant="contained" disabled={isLoading}
                    onClick={() => handleRouter('/ordertypes/list')}>
                    {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : OrderTypes.ViewList}
                </Button>
            </div>
            <Spacer />

            <Form onSubmit={handleSubmit(onRegisterForm)} style={{ display: 'grid', placeContent: 'center', placeItems: 'center' }}>
                <Card id='Card' sx={{width:900}}>
                    <Grid container spacing={2} padding={2}>
                        <Grid item xs={12}>
                            <Typography id='Typography' sx={{ padding: .5 }}>{OrderTypes.OrderType} *</Typography>
                            <TextField style={{width:700}} id='OrderType' fullWidth sx={style} variant='filled'
                                InputProps={{ disableUnderline: true }}
                                inputProps={{ maxLength: 100 }}
                                label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Tipo de Orden</Typography>}
                                {...register('OrderType', { required: OrderTypes.required })}
                                error={!!errors.OrderType}
                                FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                helperText={errors.OrderType?.message}
                            />
                        </Grid>
                    </Grid>
                </Card>
                <Button disabled={isSubmitting} type="submit" id="Button2" variant="contained" fullWidth sx={{ margin: 1 }}>
                    {isSubmitting ? <CircularProgress color='inherit' size={25} thickness={4} /> : OrderTypes.Register}
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
        props: { OrderTypes: response.default.OrderTypes }
    }
}