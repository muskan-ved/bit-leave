// ** Icons Imports
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  TextField,
  Typography
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import LoadingButton from '@mui/lab/LoadingButton'

// ** Imports react
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// ** Import redux store
import { AppDispatch, RootState } from 'src/store'
import { loadDashboardAnalytics, loadDashboardSenariosAnalytics } from 'src/store/employee'

//  ** Import Toaster
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TrendsChart from '../stats/trendsChart'

const Scenarios = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analyticsData, setAnalyticsData] = useState<any>([])
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [data, setData] = useState<any>({
    Headcount: '',
    AverageSalary: ''
  })

  const [error, setError] = useState<any>({
    Headcount: '',
    AverageSalary: ''
  })

  const dispatch = useDispatch<AppDispatch>()
  const employeeDetails: any = useSelector((state: RootState) => state.employee)

  const refreshbtn = async () => {
    fetchDataFromRedux()
  }

  const fetchDataFromRedux = async () => {
    setIsLoading(true)
    const empData = await dispatch(loadDashboardAnalytics())
    if (empData.payload != null) {
      const filterLeavesData = empData.payload.data.pages.filter((p: any) => p.category === 'Stats')
      setData({
        Headcount: filterLeavesData[0].data.headCount,
        AverageSalary: filterLeavesData[0].data.averageSalary
      })
      setIsLoading(false)
    } else {
      toast.error('Unfortunately, there was an issue to load the data, please try again later')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (employeeDetails.pages.length === 0) {
      fetchDataFromRedux()
    } else {
      const filterLeavesData = employeeDetails.pages.filter((p: any) => p.category === 'Stats')
      setData({
        Headcount: filterLeavesData[0].data.headCount,
        AverageSalary: filterLeavesData[0].data.averageSalary
      })
    }
  }, [])

  const handleOnChange = async (e: any) => {
    const targetValue = e.target.value
    const targetId = e.target.id

    if (targetValue.includes('-') || targetValue === '0') {
      setError({ ...error, [targetId]: '' })
      setData({ ...data, [targetId]: '1' })
    } else if (targetValue === '') {
      setError({ ...error, [targetId]: `${targetId} is required` })
      setData({ ...data, [targetId]: targetValue })
    } else {
      setError({ ...error, [targetId]: '' })
      setData({ ...data, [targetId]: targetValue })
    }
  }

  const seriesDataForLiabilityTrends: number[] = [],
    optionsDataForLiabilityTrends: string[] = []

  if (analyticsData) {
    for (let index = 0; index < analyticsData?.length; index++) {
      optionsDataForLiabilityTrends.push(analyticsData[index].month)
    }
    for (let index = 0; index < analyticsData?.length; index++) {
      seriesDataForLiabilityTrends.push(Number(analyticsData[index].leaveLiability?.toFixed(2)))
    }
  }

  const handleSubmit = async (e: any) => {
    setSubmitLoading(true)
    const dataSenario = await dispatch(loadDashboardSenariosAnalytics(data))
    if (dataSenario.payload != null) {
      setAnalyticsData(dataSenario.payload.data)
      setSubmitLoading(false)
    }
    setSubmitLoading(false)
  }
  console.log(
    seriesDataForLiabilityTrends,
    optionsDataForLiabilityTrends,
    'optionsDataForLiabilityTrends',
    analyticsData.length
  )

  if (isLoading && !data.Headcount && !data.AverageSalary) return <CircularProgress color='success' />

  return (
    <>
      <ToastContainer />
      <Grid container spacing={9}>
        <Grid item xs={12} md={12} mb={5} sx={{ textAlign: 'right' }}>
          <Box
            component='img'
            sx={{
              width: '40px',
              marginRight: '12px',
              marginBottom: '-15px'
            }}
            alt='The Xero Connect logo.'
            src='/images/cards/xero_icon.png'
          />
          <Button variant='contained' onClick={refreshbtn} disabled={isLoading}>
            <RefreshIcon sx={{ fontSize: '1.1rem', mr: '4px' }} />
            Refresh
          </Button>
          <Divider></Divider>
        </Grid>
      </Grid>
      <Card>
        <CardHeader
          title={
            <>
              <Typography
                component={'span'}
                sx={{ float: 'left', lineHeight: 1.6, fontWeight: 500, fontSize: '1.25rem' }}
              >
                Scenarios
              </Typography>{' '}
              <Avatar
                src='/images/cards/directReport.png'
                sx={{ borderRadius: 0, position: 'relative', padding: '7px', top: '-8px' }}
              />
            </>
          }
          subheader={<Divider></Divider>}
        />
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12} md={5} lg={5} sx={{ mt: 5 }}>
              <TextField
                id='Headcount'
                label='Headcount'
                type='number'
                value={data.Headcount}
                onChange={e => {
                  handleOnChange(e)
                }}
                placeholder='Please enter Headcount'
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ width: '100%' }}
              />
              <Typography color={'red'}>{error.Headcount}</Typography>
            </Grid>
            <Grid item xs={12} md={5} lg={5} sx={{ mt: 5 }}>
              <TextField
                id='AverageSalary'
                label='Average Salary'
                type='number'
                value={data.AverageSalary}
                onChange={e => {
                  handleOnChange(e)
                }}
                placeholder='Please enter Average Salary'
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ width: '100%' }}
              />
              <Typography color={'red'}>{error.AverageSalary}</Typography>
            </Grid>
            <Grid item xs={12} md={2} lg={2} sx={{ mt: 5 }}>
              {!submitLoading ? (
                <Button variant='contained' size='large' onClick={handleSubmit} sx={{ p: '14.8px 58px !important' }}>
                  Apply
                </Button>
              ) : (
                <LoadingButton
                  variant='contained'
                  loading={submitLoading}
                  size='large'
                  disabled
                  sx={{ p: '14.8px 58px !important' }}
                >
                  Apply
                </LoadingButton>
              )}
            </Grid>
            {analyticsData?.length > 0 ? (
              <Grid item md={12} xs={12}>
                <Card>
                  <CardHeader
                    title={
                      <>
                        <Typography
                          component={'span'}
                          sx={{ float: 'left', lineHeight: 1.6, fontWeight: 500, fontSize: '1.25rem' }}
                        >
                          Leave Liability Scenarios
                        </Typography>{' '}
                        <Avatar
                          src='/images/cards/trends.png'
                          sx={{ borderRadius: 0, position: 'relative', top: '-8px' }}
                        />
                      </>
                    }
                    subheader={<Divider></Divider>}
                  />
                  <CardContent>
                    {optionsDataForLiabilityTrends[0] === null || !seriesDataForLiabilityTrends ? (
                      <Typography variant='body2'>No data to display</Typography>
                    ) : (
                      <TrendsChart options={optionsDataForLiabilityTrends} series={seriesDataForLiabilityTrends} />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ) : null}
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}

Scenarios.acl = {
  action: 'read',
  subject: 'dashboardScenarios'
}

export default Scenarios
