// ** React Imports
import {  useEffect, useState } from 'react'

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

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//  ** Types Imports
import { thresholds } from 'src/types/thresholds'

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { excessLeaveThresholds, getExcessLeave } from 'src/store/thresholds'

const Thresholds = () => {
  const [data, setData] = useState<thresholds | null>(null);
  const [leaveNotification, setLeaveNotification] = useState<thresholds | number>();
  const [leaveWarning, setLeaveWarning] = useState<thresholds | number>();
  const [maximumPayout, setMaximumPayout] = useState<thresholds | number>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  const fetchData = async () => {
    const userData = localStorage.getItem("userData")
    let orgId;
    if (userData != null) {
      const data = JSON.parse(userData)
      orgId = data.orgId;
    }
    await dispatch(getExcessLeave(orgId)).then((res) => {
        const data = res.payload.data.organisation;
        setLeaveNotification(data.organisationssettings[0].thrleavenotification)
        setLeaveWarning(data.organisationssettings[0].thrleavewarning)
        setMaximumPayout(data.organisationssettings[0].thrpayoutfrequency)
        setData(data)
        setIsLoading(false);
      })
  };

  useEffect(() => {
    if (!data) {
      setIsLoading(true);
      fetchData();
    }
  }, []);

  const handleOnChange = (element:any) =>{
    if(element.target.name === "Excess Leave Notification"){
      setLeaveNotification(element.target.value)
    }
    else if(element.target.name === "Excess Leave Warning"){
      setLeaveWarning(element.target.value)
    }
    else if(element.target.name === "Maximum Payout"){
      setMaximumPayout(element.target.value)
    }
  }

  const handleSubmit = async(e:any) =>{
    e.preventDefault();

    if(leaveNotification || leaveWarning || maximumPayout){
    const data = {
      thrleavenotification: leaveNotification,
      thrleavewarning: leaveWarning,
      thrpayoutfrequency: maximumPayout,
    }
    setIsLoading(true);
     await dispatch(excessLeaveThresholds(data)).then(()=>{
        setIsLoading(false);
        toast.success("Successfully updated thresholds", {
          autoClose: 5000,
          hideProgressBar: false,
        })
        fetchData();
      }).catch(()=>{
        setIsLoading(false);
        toast.error("Failed to updated thresholds", {
          autoClose: 5000,
          hideProgressBar: false,
        })
    })
  }else{
    //else statement
  }
  }

  if (isLoading)
    return (<CircularProgress color="success" />)

    if (!isLoading && !data) {

      return (
        <Grid container spacing={6}>
          <Grid item md={12} xs={12}>
            <Card>
              <CardHeader title='Your Dashboard' />
              <CardContent>
                <Typography sx={{ mb: 4 }}>You are not fully onboarded !</Typography>
                <Typography>Please use the sync org functionality to upload your and other employee details.</Typography>
                <br />
              </CardContent>
            </Card>
          </Grid>
        </Grid>)
    }

  if (!isLoading && data) {
    return (
      <Card>
        <ToastContainer position="top-right" autoClose={false} newestOnTop={false} closeOnClick	rtl={false}	pauseOnFocusLoss draggable />
        <CardHeader title='Excess Leave Thresholds' subheader={<Divider></Divider>} />
        <CardContent>
          <Typography sx={{ mb: 4.5 }}>
            Adjust the excess Leave thresholds
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Excess Leave Notification'
                  name='Excess Leave Notification'
                  defaultValue={
                    leaveNotification
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <OfficeBuildingOutline />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Excess Leave Warning'
                  name='Excess Leave Warning'
                  defaultValue={leaveWarning}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AlertBoxOutline />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='Maximum Payout'
                  name='Maximum Payout'
                  defaultValue={maximumPayout}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CurrencyUsd />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
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


