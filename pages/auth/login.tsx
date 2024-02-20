import { useState, useEffect, useContext } from 'react';
import { GetServerSideProps } from 'next'
import NextLink from 'next/link';
import { signIn, getSession, getProviders } from 'next-auth/react';
import { Card as CardMaterial, Button as ButtonMaterial, Box, Chip, Divider, Grid, Link, TextField, Typography, CssBaseline, InputAdornment, IconButton, Checkbox, StepLabel, FormControlLabel, Stack, createTheme, alpha, OutlinedInputProps, CircularProgress } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { jwt, validations } from '../../utils';
import { useRouter } from 'next/router';
import { AuthContext } from '../../context/auth/AuthContext';
import Cookies from 'js-cookie';
import { isValidToken } from '../../utils/jwt';
import { AuthLayout } from '../../components/layouts';
import { FullScreenLoading } from '../../components/ui/FullScreenLoading';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Row } from 'react-bootstrap';
import { Col, Image } from '@nextui-org/react';
import { Card, Button, Loading, Text } from '@nextui-org/react';
import { LanguageSelector } from '../../components/language/LanguageSelector';
type FormData = {
    Email: string,
    Password: string,
};


export default function LoginPage(props) {
    const { login } = props;
    const { user, token } = useContext(AuthContext);

    const router = useRouter();
    const { loginUser } = useContext(AuthContext);

    const { register, handleSubmit, formState: { errors, isSubmitSuccessful, isSubmitting, isValidating, isValid } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
        getProviders().then(prov => {
            // console.log({prov});
            setProviders(prov)
        })
    }, []);


    /*useEffect(() =>{
        if(!Cookies.get('user')){
            router.push(`${'/auth/login?p='}`);
        }
    }, [router]);*/
    const [messageValue, setMessage] = useState('');

    const onLoginUser = async ({ Email, Password }: FormData) => {
        setShowError(false);

        const { hasError, message } = await loginUser(Email, Password);
        if (hasError) {
            const english = message == undefined ? '' : message[0].english!
            const spanish = message == undefined ? '' : message[0].spanish!
            setMessage(router.locale != 'en' ? spanish : english)
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        const destination = router.query.p?.toString() || '/';
        router.replace(destination);
        //await signIn('credentials', { UserName, Password });
    }

    const [valueEye, setValues] = useState(false);

    const [checkClick, setValuesCheck] = useState(false);


    const handleClickShowPassword = () => {
        setValues(!valueEye);
    };


    const changeColor = () => {
        setValuesCheck(!checkClick);
    };

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


    return (
        <AuthLayout title={'Login'}>
            <Grid container spacing={2} sx={{ display: 'grid', placeContent: 'center' }}>
                <div style={{ height: 185, width: '100%' }}>
                    <Image
                        loading='lazy'
                        src="/img/lrcp-logo.png"
                        width={200}
                        height={200}
                    />
                </div>
                <CardMaterial id="Card3" className='fadeIn' sx={{ display: 'grid', placeContent: 'center' }}>
                    <form onSubmit={handleSubmit(onLoginUser)} >
                        <Box sx={{ width: 371, padding: '10px 20px' }} >
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <Stack direction="row" justifyContent="center" alignItems="center" spacing={2}>
                                        <Text
                                            h1
                                            size={45}
                                            css={{
                                                fontFamily: 'M PLUS 2', fontWeight: 800,
                                                color: '#393939',
                                                letterSpacing: '-1px'
                                            }}
                                            weight="semibold"
                                        >
                                            {login.title}
                                        </Text>
                                    </Stack>
                                    <Chip
                                        label={messageValue}
                                        color="error"
                                        icon={<ErrorOutline />}
                                        className="fadeIn"
                                        sx={{ display: showError ? 'flex' : 'none' }}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        sx={style}
                                        InputProps={{ disableUnderline: true } as Partial<OutlinedInputProps>}
                                        type="text"
                                        label={<Typography id='Typography'>{login.email}</Typography>}
                                        variant="filled"
                                        fullWidth
                                        {...register('Email', {
                                            required: 'Favor de llenar este campo',

                                        })}
                                        error={!!errors.Email}
                                        helperText={errors.Email?.message}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        sx={style}
                                        variant="filled"
                                        label={<Typography id='Typography'>{login.password}</Typography>}
                                        type={valueEye ? 'text' : 'password'}
                                        fullWidth
                                        {...register('Password', {
                                            required: 'Favor de llenar este campo',
                                            minLength: { value: 6, message: '6 caracteres minimo' }
                                        })}
                                        error={!!errors.Password}
                                        helperText={errors.Password?.message}
                                        FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                                        InputProps=
                                        {{
                                            disableUnderline: true,
                                            endAdornment:
                                                <>
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            aria-label="toggle password visibility"
                                                            onClick={handleClickShowPassword}
                                                            edge="end"
                                                        >
                                                            {valueEye ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                </>
                                        }}
                                    />

                                </Grid>
                                <Grid item xs={12}>
                                    {
                                        isSubmitting

                                            ?

                                            <ButtonMaterial
                                                disabled
                                                sx={{ width: '100%', minHeight: '4vh', textAlign: 'justify' }}
                                                variant='contained' id='Button2' size='large' type="button" color="primary">
                                                <CircularProgress color='inherit' size={25} thickness={4} />
                                            </ButtonMaterial>

                                            :

                                            <ButtonMaterial
                                                variant='contained'
                                                type="submit"
                                                id='Button2' size='large'
                                                sx={{ width: '100%', height: '100%', textAlign: 'justify' }}
                                            >
                                                <span >{login.title}</span>
                                            </ButtonMaterial>

                                    }

                                </Grid>

                                <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                                    <Divider sx={{ width: '100%', mb: 2 }} />
                                </Grid>

                                {/* <Grid item xs={12} display='flex' justifyContent='end'>
                                    <NextLink
                                        href={router.query.p ? `/auth/register?p=${router.query.p}` : '/auth/register'}
                                        passHref>
                                        <Link underline='always'>

                                                    ¿Do you not have an account?


                                        </Link>

                                    </NextLink>

                                </Grid> */}

                            </Grid>
                        </Box>
                    </form>
                </CardMaterial>
            </Grid>
        </AuthLayout>
    )
}


export const getServerSideProps: GetServerSideProps = async ({ req, query, locale }) => {

    const { token = '' } = req.cookies;

    const response = await import(`../../lang/${locale}.json`);
    // console.log(response.default.login);
    let isValidToken = false;
    try {
        await jwt.isValidToken(token);
        isValidToken = true;

    } catch (error) {
        isValidToken = false;

    }

    if (isValidToken) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            }
        };
    }

    return {
        props: { login: response.default.login }
    }
}

