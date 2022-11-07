// ** React Imports
import { useState, ReactNode } from 'react';

// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import Alert from '@mui/material/Alert'
import MuiLink from '@mui/material/Link'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import useMediaQuery from '@mui/material/useMediaQuery'
import OutlinedInput from '@mui/material/OutlinedInput'
import { styled, useTheme } from '@mui/material/styles'
import FormHelperText from '@mui/material/FormHelperText'
import InputAdornment from '@mui/material/InputAdornment'
import Typography, { TypographyProps } from '@mui/material/Typography'
import MuiFormControlLabel, { FormControlLabelProps } from '@mui/material/FormControlLabel'
import { Divider } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

// ** Icons Imports
import EyeOutline from 'mdi-material-ui/EyeOutline'
import EyeOffOutline from 'mdi-material-ui/EyeOffOutline'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Configs
import themeConfig from 'src/configs/themeConfig'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import * as gtag from '../../lib/gtag'

// ** Styled Components
const LoginIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(50),
  width: '500px',
  paddingRight: '0 !important', 
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const LoginIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
  alignContent: 'centre',
  [theme.breakpoints.down('xl')]: {
    maxWidth: '38rem'
  },
  [theme.breakpoints.down('lg')]: {
    maxWidth: '30rem'
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 400
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 450
  }
}))

const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.down('md')]: {
    maxWidth: 400
  }
}))

const TypographyStyled = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontWeight: 600,
  letterSpacing: '0.18px',
  marginBottom: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: { marginTop: theme.spacing(8) }
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(8).required()
})

const defaultValues = {
  password: '',
  email: '',
  apiErrors : ''
}

interface FormData {
  email: string
  password: string
  apiErrors : string
}

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  // ** Hooks
  const auth = useAuth()
  const theme = useTheme()
  const { settings } = useSettings()
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  // ** Vars
  const { skin } = settings

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const onSubmit = (data: FormData) => {
    setIsProcessing(true);
     const { email, password } = data
     gtag.event({
      action: 'login',
      category: 'login',
      label: "login",
      value:'login'
    })

     auth.login({ email, password }, err => {
      if(err.email)
      {
      setError('email', {
        type: 'manual',
          message: 'Email or Password is invalid'
        })
      }

      if(err.Message)
      {
        setError('apiErrors', {
          type: 'manual',
          message: err.Message
        })
      }
      setIsProcessing(false);
    })
  }

  const imageSource = skin === 'bordered' ? 'bit.leave' : 'bit.leave'

  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 1.0, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'left' }}>
          <LoginIllustrationWrapper>
            <LoginIllustration
              alt='login-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </LoginIllustrationWrapper>
          <br/>
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}`} : {}}>
        <Box
          sx={{
            p: 7,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper'
          }}
        >
          <BoxWrapper>
            <Box sx={{ mb: 6 }}>
              <TypographyStyled variant='h5'>{`Welcome to ${themeConfig.templateName}! 👋🏻`}</TypographyStyled>
              <Typography variant='body2'>Please sign-in to your account below.</Typography>
            </Box>
            {errors.apiErrors && <Alert severity='error'>{errors.apiErrors.message}</Alert>}
            <Divider sx={{ mt: 5, mb: 7.5, '& .MuiDivider-wrapper': { px: 4 } }}></Divider>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
              <FormControl fullWidth sx={{ mb: 4 }}>
                <Controller
                  name='email'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <TextField
                      autoFocus
                      label='Email'
                      value={value}
                      onBlur={onBlur}
                      onChange={onChange}
                      error={Boolean(errors.email)}
                      placeholder='john@mycompany.com'
                    />
                  )}
                />
                {errors.email && <FormHelperText sx={{ color: 'error.main' }}>{errors.email.message}</FormHelperText>}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor='auth-login-v2-password' error={Boolean(errors.password)}>
                  Password
                </InputLabel>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <OutlinedInput
                      value={value}
                      onBlur={onBlur}
                      label='Password'
                      onChange={onChange}
                      id='auth-login-v2-password'
                      error={Boolean(errors.password)}
                      type={showPassword ? 'text' : 'password'}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton
                            edge='end'
                            onMouseDown={e => e.preventDefault()}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                      autoComplete={'true'}
                    />
                  )}
                />
                {errors.password && (
                  <FormHelperText sx={{ color: 'error.main' }} id=''>
                    {errors.password.message}
                  </FormHelperText>
                )}
              </FormControl>
              <Box
                sx={{ mb: 4, display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'space-between' }}
              >
                <FormControlLabel
                  label='Remember Me'
                  control={<Checkbox />}
                  sx={{ '& .MuiFormControlLabel-label': { color: 'text.primary' } }}
                />
                <Link passHref href='/forgot-password'>
                  <Typography component={MuiLink} variant='body2' onClick={() => {gtag.event({
                    action: 'Forgot_Password',
                    category: 'Forgot_Password',
                    label: "Forgot_Password",
                    value:'Forgot_Password'
                  })}} sx={{ color: 'primary.main' }}>
                    Forgot Password?
                  </Typography>
                </Link>
              </Box>
              <LoadingButton loading={isProcessing}  fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7 }}>
                Login
              </LoadingButton>
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Typography sx={{ mr: 2, color: 'text.secondary' }}>New on our platform?</Typography>
                <Typography>
                  <Link passHref href='/register'>
                    <Typography component={MuiLink} sx={{ color: 'primary.main' }} onClick={() => {gtag.event({
                      action: 'Create_an_account',
                      category: 'Create_an_account',
                      label: "Create_an_account",
                      value:'Create_an_account'
                    })}}>
                      Create an account
                    </Typography>
                  </Link>
                </Typography>
              </Box>
            </form>
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

LoginPage.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginPage.guestGuard = true

export default LoginPage
