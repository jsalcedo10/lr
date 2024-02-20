import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

import NextLink from 'next/link';
import { signIn, getSession } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { Box, Card, Chip, Divider, Grid, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';

//import { AuthContext } from '../../context';
import { AuthLayout } from '../../components/layouts'
import { jwt, validations } from '../../utils';
import { AuthContext } from '../../context/auth/AuthContext';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Button, Col, Row } from '@nextui-org/react';

type FormData = {
    Email: string;
    UserName: string;
    Password: string;
    Entity_Id: number;

};


const RegisterPage = () => {

    const router = useRouter();
    const { registerUser } = useContext(AuthContext);


    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterForm = async ({ UserName, Password, Email, Entity_Id }: FormData) => {
        setShowError(false);
        let Active = true;
        let IsAdmin = 0;
        let IsEmployee = 0;
        let Department_Id = 1;
        let Position_Id = 1;

        const { hasError, message } = await registerUser(UserName, Password, Email, Active, IsAdmin,IsEmployee, Department_Id, Entity_Id, Position_Id);

        if (hasError) {
            setShowError(true);
            setErrorMessage(message!);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        const destination = `${'/auth/login?p='}`;
        router.replace(destination);
        //await signIn('credentials',{ UserName, Password });

    }

    const [valueEye, setValues] = useState(false);

    const [entity, setEntityActual] = useState<any[]>([]);

    const handleClickShowPassword = () => {
        setValues(!valueEye);
    };

    const handleEntityActual = (event: any) => {
        setEntityActual(event.target.value);
    };

    return (
        <AuthLayout title={'Sign in'}>
            <Card id="Card" className='fadeIn'>
                <form onSubmit={handleSubmit(onRegisterForm)}>
                    <Box sx={{ width: 500, padding: '10px 20px' }}>
                        <Grid container spacing={2}>
                            <Grid item xs={15}>
                                <Typography variant='h3' id="h2" component="h3">Create an account</Typography>
                                <Chip
                                    label="Error"
                                    color="error"
                                    icon={<ErrorOutline />}
                                    className="fadeIn"
                                    sx={{ display: showError ? 'flex' : 'none' }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    label="User Name"
                                    variant="outlined"
                                    type="text"
                                    fullWidth
                                    {...register('UserName', {
                                        required: 'This field is required',
                                        minLength: { value: 2, message: '2 characters minimun' }
                                    })}
                                    error={!!errors.UserName}
                                    helperText={errors.UserName?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    variant="outlined"
                                    type="email"
                                    fullWidth
                                    {...register('Email', {
                                        required: 'This field is required',
                                        minLength: { value: 2, message: '2 characters minimun' }
                                    })}
                                    error={!!errors.Email}
                                    helperText={errors.Email?.message}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Password"
                                    type={valueEye ? 'text' : 'password'}
                                    variant="outlined"
                                    fullWidth
                                    {...register('Password', {
                                        required: 'This field is required',
                                        minLength: { value: 6, message: '6 characters minimin' }
                                    })}
                                    InputProps=
                                    {{
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
                                    error={!!errors.Password}
                                    helperText={errors.Password?.message}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    style={{ width: '100%' }}
                                >
                                    Create
                                </Button>
                            </Grid>

                            <Grid item xs={12} display='flex' flexDirection='column' justifyContent='end'>
                                <Divider sx={{ width: '100%', mb: 2 }} />
                            </Grid>
                            <Grid item xs={12} display='flex' justifyContent='end'>
                                <NextLink
                                    href={router.query.p ? `/auth/login?p=${router.query.p}` : '/auth/login'}
                                    passHref
                                >
                                    <Link underline='always'>

                                        ¿Already have an account?


                                    </Link>
                                </NextLink>
                            </Grid>
                        </Grid>
                    </Box>
                </form>
            </Card>

        </AuthLayout>
    )
}


export default RegisterPage