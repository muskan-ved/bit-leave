
// ** React Imports
import { ReactNode, SetStateAction, SyntheticEvent, useState } from 'react'
import OtpInput from "react-otp-input";
// ** Next Imports
import Link from 'next/link'

// ** MUI Components
import MuiLink from '@mui/material/Link'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import Typography, { TypographyProps } from '@mui/material/Typography'

// ** Icons Imports
import ChevronLeft from 'mdi-material-ui/ChevronLeft'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'
import { useAuth } from 'src/hooks/useAuth'
// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import { Button, FormHelperText } from '@mui/material';
import { Router } from 'mdi-material-ui';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'

// Styled Components
const UserConfirmationIllustrationWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(20),
  paddingRight: '0 !important',
  [theme.breakpoints.down('lg')]: {
    padding: theme.spacing(10)
  }
}))

const UserConfirmationIllustration = styled('img')(({ theme }) => ({
  maxWidth: '48rem',
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

const ConfirmUser = () => {
  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()
  const auth = useAuth()
  const router = useRouter()

  // ** Vars
  const { skin } = settings
  const userEmail= window.localStorage.getItem('userEmail');
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const imageSource =
    skin === 'bordered' ? 'bit.leave' : 'bit.leave'
  const [code, setCode] = useState("");
  const handleChange = (code: SetStateAction<string>) => setCode(code);

  const defaultValues = {
    apiErrors: ''
  }
  const schema = yup.object().shape({
    code: yup.string().min(6).required(),
    email: yup.string().email().required()
  })
  const {
    setError,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })


  const onSubmit =() => {
    if(userEmail != null)
    {
      const email = userEmail
      console.log(userEmail)
      auth.confirmUser({ email, code }, err => {
        if(err.Message)
      {
        setError('apiErrors', {
          type: 'manual',
          message: err.Message
        })
      }
       })
    }
    else{
      router.push('/login') 
    }
  }

    const handleResend =() => {
    //   if(userEmail != null)
    //   {
    //   const email = userEmail
    //   auth.resendCode({ email }, err => {
    //     if(err.Message)
    //   {
    //     setError('apiErrors', {
    //       type: 'manual',
    //       message: err.Message
    //     })
    //   }
    //    })
    //   }
    //   else{
    //     router.push('/login')
    //   }
    }
  return (
    <Box className='content-right'>
      {!hidden ? (
        <Box sx={{ flex: 0.8, display: 'flex', position: 'relative', alignItems: 'center', justifyContent: 'left' }}>
          <UserConfirmationIllustrationWrapper>
            <UserConfirmationIllustration
              alt='forgot-password-illustration'
              src={`/images/pages/${imageSource}-${theme.palette.mode}.png`}
            />
          </UserConfirmationIllustrationWrapper>
          <FooterIllustrationsV2 image={`/images/pages/auth-v2-forgot-password-mask-${theme.palette.mode}.png`} />
        </Box>
      ) : null}
      <RightWrapper sx={skin === 'bordered' && !hidden ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
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
              <TypographyStyled variant='h5' sx={{mb: 6}}>User Confirmation</TypographyStyled>
              {errors.apiErrors && <FormHelperText sx={{ color: 'error.main'}}>{errors.apiErrors.message}</FormHelperText>}
            </Box>
           
      
      <OtpInput
        value={code}
        onChange={handleChange}
        numInputs={6}
        separator={<span style={{ width: "8px" }}></span>}
        isInputNum={true}
        shouldAutoFocus={true}
        inputStyle={{
          border: "1px solid #CFD3DB",
          borderRadius: "8px",
          width: "54px",
          height: "54px",
          fontSize: "12px",
          color: "#000",
          fontWeight: "400",
          caretColor: "blue"
        }}
        focusStyle={{
          border: "1px solid #CFD3DB",
          outline: "none"
        }}
      />
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>    
                <Button fullWidth size='large' type='submit' variant='contained' sx={{ mb: 7, mt: 7 }}
                onClick={handleSubmit(onSubmit)}>Verify</Button>
              </Typography>
              <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Link passHref href='/login'>
                  <Typography
                    component={MuiLink}
                    sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', justifyContent: 'center'}}
                  >
                    <ChevronLeft sx={{ mr: 1.0, fontSize: '2rem' }} />
                    <span>Back to login</span>
                  </Typography>
                </Link>

                <Button  sx={{ml: 30}} onClick={handleResend}>Resend Code</Button>
              </Typography>
             
          </BoxWrapper>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ConfirmUser.guestGuard = true
ConfirmUser.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default ConfirmUser

