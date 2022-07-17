// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Divider from '@mui/material/Divider'
import { AlertBoxOutline, CurrencyUsd, OfficeBuildingOutline } from 'mdi-material-ui'

const Thresholds = () => {
  return (
    <Card>
      <CardHeader title='Excess Leave Thresholds' subheader={<Divider></Divider>}/>
      <CardContent>
        <Typography sx={{ mb: 4.5 }}>
          Adjust the excess Leave thresholds
        </Typography>
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Excess Leave Notification'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <OfficeBuildingOutline />
                    </InputAdornment>
                  )
                }}
              >34</TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Excess Leave Warning'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <AlertBoxOutline />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                type='number'
                label='Maximum Payout'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>
                      <CurrencyUsd />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type='submit' variant='contained' size='large'>
                Update
              </Button>
            </Grid>
          </Grid>
        </form>
      </CardContent>
    </Card>
  )
}

Thresholds.acl = {
  action: 'manage',
  subject: 'Thresholds'
}

export default Thresholds


