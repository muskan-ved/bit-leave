import {
  Button,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  TextField,
  Grid,
  Card,
  CardActions
} from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

const Payroll = () => {
  return (
    <Card>
      <CardHeader title='Payroll Details' subheader={<Divider></Divider>} />
      <CardContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='string'
              label='Payroll Name'
              name='Payroll Name'
              defaultValue={'XERO'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                )
              }}
              disabled
            />
          </Grid>
        </Grid>
      </CardContent>
      <CardActions>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <Button variant='contained'>
              Disconnect
            </Button>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  )
}

export default Payroll
