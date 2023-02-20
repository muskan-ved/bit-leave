// ** React Imports
import { useEffect, useState } from 'react'

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
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

// ** Icons Imports
import Divider from '@mui/material/Divider'
import { AlertBoxOutline, AlertCircle, CurrencyUsd, OfficeBuildingOutline } from 'mdi-material-ui'

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//  ** Types Imports
import { thresholds } from 'src/types/thresholds'

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { excessLeaveThresholds, getExcessLeave } from 'src/store/thresholds'
import LoadingButton from '@mui/lab/LoadingButton'
import * as gtag from '../../lib/gtag'
import { loadEmployee } from 'src/store/employee'
import { employeeType } from 'src/types/dashboard'

const Thresholds = () => {
  const [data, setData] = useState<thresholds | null>(null)
  const [empData, setEmpData] = useState<employeeType | null>(null)
  const [leaveNotification, setLeaveNotification] = useState<thresholds | number>()
  const [leaveWarning, setLeaveWarning] = useState<thresholds | number>()
  const [maximumPayout, setMaximumPayout] = useState<thresholds | number>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()

  const fetchData = async () => {
    await dispatch(getExcessLeave()).then(res => {
      const data = res.payload?.data
      setLeaveNotification(data[0]?.organisationssettings?.[0].thrleavenotification)
      setLeaveWarning(data[0]?.organisationssettings?.[0].thrleavewarning)
      setMaximumPayout(data[0]?.organisationssettings?.[0].thrpayoutfrequency)
      setData(data)
      setIsLoading(false)
    })
  }

  const fetchDataFromRedux = async () => {
    setIsLoading(true);
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setEmpData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!data) {
      setIsLoading(true)
      fetchData()
      fetchDataFromRedux();
    }
  }, [])

  const handleOnChange = (element: any) => {
    if (element.target.name === 'Excess Leave Notification') {
      setLeaveNotification(element.target.value)
    } else if (element.target.name === 'Excess Leave Warning') {
      setLeaveWarning(element.target.value)
    } else if (element.target.name === 'Maximum Payout') {
      setMaximumPayout(element.target.value)
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    gtag.event({
      action: 'thresholds_update',
      category: 'thresholds',
      label: "thresholds_update",
      value:'thresholds_update'
    })
    if (leaveNotification || leaveWarning || maximumPayout) {
      const data = {
        thresholdLeaveNotification:
          typeof leaveNotification === 'string' ? parseInt(leaveNotification) : leaveNotification,
        thresholdLeaveWarning: typeof leaveWarning === 'string' ? parseInt(leaveWarning) : leaveWarning,
        thresholdPayoutFrequency: typeof maximumPayout === 'string' ? parseInt(maximumPayout) : maximumPayout
      }
      setLoading(true)
      await dispatch(excessLeaveThresholds(data))
        .then(res => {
          setLoading(false)
          if (res.payload) {
            fetchData();
            toast.success('Successfully updated thresholds', {
              autoClose: 5000,
              hideProgressBar: false
            })
          } else {
            toast.error('Failed to updated thresholds', {
              autoClose: 5000,
              hideProgressBar: false
            })
          }
          fetchData()
        })
        .catch(() => {
          setLoading(false)
          toast.error('Failed to updated thresholds', {
            autoClose: 5000,
            hideProgressBar: false
          })
        })
    } else {
      //else statement
      toast.error('Sorry, the action cannot be completed at this time. Please contact us for any issues')
    }
  }

  if (isLoading) return <CircularProgress color='success' />

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
      </Grid>
    )
  }

  if (!isLoading && data) {
    return (
      <Card>
        <ToastContainer
          position='top-right'
          autoClose={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
        />
        <CardHeader title='Excess Leave Thresholds' subheader={<Divider></Divider>} />
        <CardContent>
          <Typography sx={{ mb: 4.5 }}>Adjust the excess Leave thresholds</Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Excess Leave Notification (in days)'
                  name='Excess Leave Notification'
                  defaultValue={leaveNotification}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <OfficeBuildingOutline />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Tooltip title='Refers to number of days before the excess leave notification is triggered.' arrow>
                          <HelpOutlineIcon />
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  onChange={ele => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Excess Leave Warning (in days)'
                  name='Excess Leave Warning'
                  defaultValue={leaveWarning}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AlertBoxOutline />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Tooltip title='Refers to number of days before the excess leave warning is triggered.' arrow>
                          <HelpOutlineIcon />
                        </Tooltip>
                      </InputAdornment>
                    )
                  }}
                  onChange={ele => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label='Maximum Payout (in days) every 12 months'
                  name='Maximum Payout'
                  defaultValue={maximumPayout}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AlertCircle />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position='end'>
                        <Tooltip title='The amount of days an employee can cash out in a 12 month period.' arrow>
                          <HelpOutlineIcon />
                        </Tooltip>
                      </InputAdornment>
                    )
                  }} 
                  onChange={ele => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                {!loading ? <Button type='submit' variant='contained' size='large' disabled={empData?.role === 3}>
                  Update
                </Button> :
                <LoadingButton loading={loading} size='large' type='submit' variant='contained' disabled>
                  Update
                </LoadingButton>
                }
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
