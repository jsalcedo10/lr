import { GetServerSideProps } from "next";
import { jwt } from "../../../utils";
import { useRouter } from "next/router";
import { EntityLayout, Layout } from "../../../components/layouts";
import { Alert, AlertTitle, Button, Card, Checkbox, CircularProgress, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Slide, TextField, Typography, alpha, createTheme } from "@mui/material";
import { Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Spacer, Text } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useSnackbar } from "notistack";
import { IUser } from "../../../interfaces";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useUsers } from "../../../hooks/useUsers";

export default function UsersEdit(props: any) {

  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitted, isSubmitSuccessful }, getValues, trigger, reset, setValue } = useForm<IUser>();

  const { user, isLoadingUser } = useUsers(`/user/register?id=${router.query.id}`)

  const userdata = (user || []).map(dataRow => {

    return {
      id: dataRow.Id,
      UserName: dataRow.UserName,
      Email: dataRow.Email,
      Password: dataRow.Password,
      IsAdmin: dataRow.IsAdmin == 1 ? true : false
    }
  });

  const { Users } = props;

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

  const [emailerror, setEmailError] = useState(false)

  const onRegisterForm = async (data: IUser) => {

    try {
      if (data == undefined) {
        return
      }
      setEmailError(false)

      const { UserName, Email, Password, IsAdmin } = data;

      const id = userdata[0]?.id;

      await axios.put(`/api/user/register`, {
        id, UserName, Email, Password, IsAdmin
      }).then((result) => {

        if (result.data.message) {
          setEmailError(true)
          enqueueSnackbar(result.data.message, {
            variant: 'error',
            autoHideDuration: 3000,
            anchorOrigin: {
              vertical: 'bottom',
              horizontal: 'left'
            }
          })
          return
        }

        if (result.status != 200) {
          return
        }

        enqueueSnackbar('El usuario ha sido guardado correctamente', {
          variant: 'success',
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left'
          }
        })
        handleRouter(`/user/list`)
        return;


      })
    }
    catch (err: any) {
      console.log(err)
    }
  }

  const [valueEye, setValues] = useState(false);
  const [isAdmin, setIsAdmin] = useState(userdata[0]?.IsAdmin);

  useEffect(() => {
    setIsAdmin(userdata[0]?.IsAdmin)
  }, [])

  const handleClickShowPassword = () => {
    setValues(!valueEye);
  };


  const handleIsAdmin = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAdmin(event.target.checked);
  };

  return (
    <EntityLayout>

      <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'end' }}>
        <Typography variant={windowDimensions.width < 1900 ? 'h5' : 'h4'} id='TypographyNeutro'
          fontWeight={500} letterSpacing={'.2px'}>{Users.EditUser}</Typography>
        <Spacer css={{ flex: 1 }} />
        <Button id='Button2' variant="contained" disabled={isLoading}
          onClick={() => handleRouter('/user/list')}>
          {isLoading ? <CircularProgress color='inherit' size={25} thickness={4} /> : Users.ViewList}
        </Button>
      </div>
      <Spacer />

      {
        isLoadingUser
          ?
          <div style={{ display: 'grid', placeContent: 'center', placeItems: 'center', height: '55vh', width: '100%' }}>
            <CircularProgress sx={{ color: '#393939' }} size={windowDimensions.width > 1900 ? 70 : 50} thickness={4} />
          </div>
          :

          <Form onSubmit={handleSubmit(onRegisterForm)} style={{ display: 'grid', placeContent: 'center', placeItems: 'center' }}>
            <Card id='Card' >
              <Grid container spacing={4} padding={2}>
                <Grid item xs={12} >
                  <Typography id='Typography' sx={{ padding: .5 }}>{Users.UserName} *</Typography>
                  <TextField id='UserName' fullWidth sx={style} variant='filled'
                    InputProps={{ disableUnderline: true }}
                    inputProps={{ maxLength: 100 }}
                    defaultValue={userdata[0]?.UserName}
                    label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Nombre de Usuario</Typography>}
                    {...register('UserName', { required: Users.required })}
                    error={!!errors.UserName}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    helperText={errors.UserName?.message}
                  />
                </Grid>
                <Grid item xs={12} >
                  <Typography id='Typography' sx={{ padding: .5 }}>{Users.Email} *</Typography>
                  <TextField id='Email' fullWidth sx={style} variant='filled'
                    InputProps={{ disableUnderline: true }}
                    inputProps={{ maxLength: 100 }}
                    type="email"
                    defaultValue={userdata[0]?.Email}
                    label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Correo Electronico</Typography>}
                    {...register('Email', { required: Users.required })}
                    error={emailerror ? true : !!errors.Email}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    helperText={emailerror ? 'Correo existente actualmente' : errors.Email?.message}
                  />
                </Grid>
                <Grid item xs={12} >
                  <Typography id='Typography' sx={{ padding: .5 }}>{Users.Password} *</Typography>
                  <TextField id='Password' fullWidth sx={style} variant='filled'
                    inputProps={{ maxLength: 100 }}
                    type={valueEye ? 'text' : 'password'}
                    defaultValue={userdata[0]?.Password}
                    label={<Typography id='TypographyNeutro' fontSize={'12px'}>Ingrese Contraseña</Typography>}
                    {...register('Password', {
                      required: Users.required,
                      minLength: { value: 6, message: '6 caracters minimo' }
                    })}
                    error={!!errors.Password}
                    FormHelperTextProps={{ sx: { fontFamily: 'Archivo', height: 1.1 } }}
                    helperText={errors.Password?.message}
                    InputProps={{
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
                <Grid item xs={12} >
                  <Typography id='Typography' sx={{ padding: .5 }}>{Users.IsAdmin}</Typography>
                  <FormControlLabel control={<Checkbox defaultChecked={userdata[0].IsAdmin} id="IsAdmin" {...register('IsAdmin', { required: false, onChange: handleIsAdmin })} />} label={<Typography id='Typography'>{'Administrador'}</Typography>} />
                </Grid>
              </Grid>
            </Card>
            <Button disabled={isSubmitting} type="submit" id="Button2" variant="contained" fullWidth sx={{ margin: 1 }}>
              {isSubmitting ? <CircularProgress color='inherit' size={25} thickness={4} /> : Users.Edit}
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
    props: { Users: response.default.Users }
  }
}