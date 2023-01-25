import {CircularProgress, Grid } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import BlankLayoutWithAppBarWrapper from 'src/@core/layouts/BlankLayoutWithAppBar'
import { AppDispatch } from 'src/store'
import { xeroRedirectUrl } from 'src/store/xeroSignup'

const XeroSignup = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const fetchRedirectUrl = async () => {
    setIsLoading(true)
    const xeroRedirectURL = await dispatch(xeroRedirectUrl())
    if (xeroRedirectURL.payload.url !== null) {
      router.replace(xeroRedirectURL.payload.url)
      setIsLoading(false)
    } else {
      toast.error('Sorry, the action cannot be completed at this time. Please contact us for any issues')
      setTimeout(() => {
        router.replace('/login')
        setIsLoading(false)
      }, 3000)
    }
  }

  useEffect(() => {
    fetchRedirectUrl()
  }, [])

  if (isLoading) {
    return (
      <Grid container spacing={5}>
        <ToastContainer />
        <Grid
          item
          md={12}
          xs={12}
          sx={{
            textAlign: 'center',
            transform: 'translate(-50%, -50%)',
            left: '50%',
            top: '50%',
            position: 'absolute'
          }}
        >
          <CircularProgress color='success' />
        </Grid>
      </Grid>
    )
  }
}

XeroSignup.getLayout = (page: ReactNode) => <BlankLayoutWithAppBarWrapper>{page}</BlankLayoutWithAppBarWrapper>
XeroSignup.guestGuard = true

export default XeroSignup
