// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const Home = () => {

  const userData = localStorage.getItem("userData")
  let fullName;
  if(userData!=null){
    const data = JSON.parse(userData)
    fullName = data.fullName;
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardHeader title={`Welcome ${fullName} !`}></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}><strong>Optimise Leave, Well-being and Balance Sheet for your Organisation.</strong></Typography>
            <Typography>
              For any help or support, feel free to contact us.
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card>
          <CardHeader title='ACL and JWT 🔒'></CardHeader>
          <CardContent>
            <Typography sx={{ mb: 2 }}>
              Access Control (ACL) and Authentication (JWT) are the two main security features of our template and are implemented in the starter-kit as well.
            </Typography>
            <Typography>Please read our Authentication and ACL Documentations to get more out of them.</Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}

export default Home
