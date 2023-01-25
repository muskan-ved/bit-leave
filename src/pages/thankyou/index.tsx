import { Box, Button, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router"
import { ReactNode, useEffect } from "react"
import BlankLayoutWithAppBarWrapper from 'src/@core/layouts/BlankLayoutWithAppBar'

const Thankyou = () => {
  
  const router = useRouter();
  const token = localStorage.getItem("accessToken")
  
  function parseJwt (token:any) {

    const base64Url = token?.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+')?.replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64)?.split('').map(function(c) {
      return '%' + ('00' + c?.charCodeAt(0)?.toString(16))?.slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  }
  
  useEffect(() => {
    if(token && router?.query?.id_token){
      const parseToken = router?.query?.id_token
      const tokenDecode = parseJwt(parseToken)
      router.replace(`/register?name=${tokenDecode.name}&email=${tokenDecode.email}`)
  }
}, [router])


    return(
<>
<Grid container sx={{justifyContent:'center'}}>
  <Box>
        <Grid
          item
          md={12}
          xs={12}
          sx={{m:4}}
        >
          <Typography variant="h2"  gutterBottom sx={{fontWeight:'800',margin:'20px 0 0 0',textAlign:'center'}}>Thankyou</Typography>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
          sx={{m:4}}
        >
          <Typography variant="subtitle2" gutterBottom sx={{textAlign:'center',fontWeight:'bold'}}>Connection to Xero established! 🔐</Typography>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
          sx={{m:4,textAlign:'center'}}
        >
          <Button  variant='contained' onClick={() => {window.close()}} >Close the tab</Button>
        </Grid>
        </Box>
        </Grid>
        <Grid container spacing={5}>
        <Box width={'100%'} >
        <Grid
          item
          md={12}
          xs={12}
          sx={{textAlign:'center'}}
        >
          <Box component='img' alt='Thankyou-img' src='/images/pages/thankyou.png' width={'30%'} sx={{margin:'2rem 0 12rem 0'}}/>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
          <Box component='img' alt='Thankyou-misc-img' src='/images/pages/misc-401-object.png' sx={{position: 'absolute', bottom: '158px', left: '258px'}}/>
        </Grid>
        <Grid
          item
          md={12}
          xs={12}
        >
         <Box component='img' alt='Thankyou-ex-icon' src='/images/pages/misc-mask-light.png' width={'100%'} sx={{position:'absolute',bottom: 0,left:'04px'}}/>
        </Grid>
        </Box>
      </Grid>
      </>
    )
}

Thankyou.getLayout = (page: ReactNode) => <BlankLayoutWithAppBarWrapper>{page}</BlankLayoutWithAppBarWrapper>
Thankyou.guestGuard = true

export default Thankyou