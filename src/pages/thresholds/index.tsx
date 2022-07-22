// ** React Imports
import {  useEffect, useState } from 'react'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Axios
import axios, { AxiosError } from 'axios'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import CircularProgress from '@mui/material/CircularProgress'

// ** Icons Imports
import Divider from '@mui/material/Divider'
import { AlertBoxOutline, CurrencyUsd, OfficeBuildingOutline } from 'mdi-material-ui'

const baseUrl = 'https://api.bitleave.co/organisations/'

type organisationssettings ={
  thrleavenotification:number,
  thrleavewarning:number,
  thrpayoutfrequency:number
}

type organisation = 
{
  id: number,
  organisationssettings : Array<organisationssettings>
}

const Thresholds = () => {
  const [data, setData] = useState<organisation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { logout } = useAuth()
  const token = localStorage.getItem("accessToken")

  const fetchData = async () => {
    const userData = localStorage.getItem("userData")
    let orgId;
    if (userData != null) {
      const data = JSON.parse(userData)
      orgId = data.orgId;
    }
    axios
      .get(baseUrl + orgId, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        const data = res.data;
        setData(data.data.organisation);
        setIsLoading(false);
      })
      .catch((reason: AxiosError) => {
        if (reason.response!.status === 401) {
          logout()
        } else {
          // Handle else
        }
      }
      )
  };

  useEffect(() => {
    if (!data) {
      setIsLoading(true);
      fetchData();
    }
  }, []);

  if (isLoading)
    return (<CircularProgress color="success" />)

  if (!isLoading && data) {
    return (
      <Card>
        <CardHeader title='Excess Leave Thresholds' subheader={<Divider></Divider>} />
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
                  defaultValue={
                    data.organisationssettings ? data.organisationssettings[0].thrleavenotification : ''
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <OfficeBuildingOutline />
                      </InputAdornment>
                    )
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Excess Leave Warning'
                  defaultValue={data.organisationssettings && data.organisationssettings[0].thrleavewarning}
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
                  defaultValue={data.organisationssettings && data.organisationssettings[0].thrpayoutfrequency}
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
}

Thresholds.acl = {
  action: 'manage',
  subject: 'Thresholds'
}

export default Thresholds


