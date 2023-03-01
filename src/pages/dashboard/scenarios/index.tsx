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
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
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
import { loadDashboardAnalytics, loadDashboardSenariosAnalytics, loadEmployee } from 'src/store/employee'

//  ** Import Toaster
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


const Scenarios = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analyticsData, setAnalyticsData] = useState<any>('')
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)
  const [employeeData, setemployeeData] = useState<any>('')
  const [orgName, setOrgName] = useState<any>('')
  const [ForcastValue, setForecast] = useState<any>('6')

  const [data, setData] = useState<any>({
    AnnualLeaveLiabilities: '',
    CurrentHeadCount: '',
    AverageLeaveBalance: '',
    AverageValue: '',
    HeadCount: '',
    SalaryIncrease: '',
    AverageLeaveDays: ''
  })

  const [error, setError] = useState<any>({
    HeadCount: '',
    SalaryIncrease: '',
    AverageLeaveDays: ''
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
      const filterScenariosData = empData.payload.data.pages.filter((p: any) => p.category === 'Scenarios')
      setData({
        AnnualLeaveLiabilities: filterScenariosData[0].data.annualLeaveLiabilities,
        CurrentHeadCount: filterScenariosData[0].data.headcount,
        HeadCount: filterScenariosData[0].data.headcount,
        AverageLeaveBalance: filterScenariosData[0].data.averageLeaveBalance,
        AverageValue: filterScenariosData[0].data.averageValue,
        SalaryIncrease: 60,
        AverageLeaveDays: 10
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
      const filterScenariosData = employeeDetails.pages.filter((p: any) => p.category === 'Scenarios')
      setData({
        AnnualLeaveLiabilities: filterScenariosData[0].data.annualLeaveLiabilities,
        CurrentHeadCount: filterScenariosData[0].data.headcount,
        HeadCount: filterScenariosData[0].data.headcount,
        AverageLeaveBalance: filterScenariosData[0].data.averageLeaveBalance,
        AverageValue: filterScenariosData[0].data.averageValue,
        SalaryIncrease: 60,
        AverageLeaveDays: 10
      })
    }
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setemployeeData(empData.payload.data)
      setOrgName(empData?.payload?.data?.orgs[0]?.name)
    }
    setIsLoading(false)
  }

  const handleOnChange = async (e: any) => {
    const targetValue = e.target.value
    const targetId = e.target.id

    if (targetValue === '') {
      setError({ ...error, [targetId]: `${targetId} is required` })
      setData({ ...data, [targetId]: targetValue })
    } else {
      setError({ ...error, [targetId]: '' })
      setData({ ...data, [targetId]: parseInt(targetValue) })
    }
  }

  const handleSubmit = async (e: any) => {
    setSubmitLoading(true)
    const requestData = {
      headcount: data.HeadCount,
      averageValue: data.AverageValue,
      annualLeaveLiabilities: data.AnnualLeaveLiabilities,
      averageLeaveBalance: data.AverageLeaveBalance,
      forecast: ForcastValue,
      projectedHeadcount: data.CurrentHeadCount,
      salaryIncrease: data.SalaryIncrease,
      averageLeaveDays: data.AverageLeaveDays
    }
    const dataSenario = await dispatch(loadDashboardSenariosAnalytics(requestData))
    if (dataSenario.payload != null) {
      setAnalyticsData(dataSenario.payload.data)
      setSubmitLoading(false)
    }
    setSubmitLoading(false)
  }

  const handleChange = (event: SelectChangeEvent) => {
    setOrgName(event.target.value)
  }

  const handleChangeForeCast = (event: SelectChangeEvent) => {
    setForecast(event.target.value)
  }

  function currencyFormat(num: any) {
    return '$' + num?.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  if (isLoading && !data.Headcount && !data.AverageSalary) return <CircularProgress color='success' />

  return (
    <>
      <ToastContainer />
      <Grid container spacing={9}>
        <Grid item xs={12} md={12} mb={5}>
          <FormControl sx={{ minWidth: 120 }} size='small'>
            <InputLabel id='demo-simple-select-readonly-label'>Organisation</InputLabel>
            <Select
              labelId='demo-simple-select-readonly-label'
              id='demo-simple-select-readonly'
              value={orgName}
              label='Organisationte'
              onChange={handleChange}
              sx={{ fontSize: '13px' }}
            >
              {employeeData?.orgs?.map((itemorg: any) => {
                return <MenuItem value={itemorg.name}>{itemorg.name}</MenuItem>
              })}
            </Select>
          </FormControl>
          <Button variant='contained' onClick={refreshbtn} disabled={isLoading} sx={{ float: 'right', mr: '4px' }}>
            <RefreshIcon sx={{ fontSize: '1.1rem', mr: '4px' }} />
            Refresh
          </Button>
          <Box
            component='img'
            sx={{
              width: '40px',
              marginRight: '12px',
              marginBottom: '-15px',
              float: 'right'
            }}
            alt='The Xero Connect logo.'
            src='/images/cards/xero_icon.png'
          />
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
            <Grid item md={12} sx={{ width: '100%' }}>
              <Box sx={{ float: 'left' }}>
                <Typography variant='subtitle2'>Your Current Annual Leave Liabilities</Typography>
                <Typography variant='subtitle2'>Your Current Headcount </Typography>
                <Typography variant='subtitle2'>Average Leave Balance </Typography>
                <Typography variant='subtitle2'>Average $ Value </Typography>
              </Box>

              <Box sx={{ float: 'right', textAlign: 'right' }}>
                <Typography variant='body2'>{currencyFormat(parseInt(data?.AnnualLeaveLiabilities))}</Typography>
                <Typography variant='body2'>{data?.CurrentHeadCount}</Typography>
                <Typography variant='body2'>
                  {currencyFormat(parseInt(data?.AverageLeaveBalance))} days per employee
                </Typography>
                <Typography variant='body2'>{currencyFormat(parseInt(data?.AverageValue))} per employee</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={12} sm={12} lg={12}>
              <Divider></Divider>
            </Grid>
            <Grid item sm={6} xs={6} md={6} lg={6}>
              <FormControl sx={{ m: 1 }} fullWidth>
                <InputLabel id='Forecast'>Forecast</InputLabel>
                <Select
                  labelId='Forecast'
                  id='demo-simple-select-readonly'
                  value={ForcastValue}
                  label='Forecast'
                  onChange={handleChangeForeCast}
                >
                  <MenuItem value={6}>6 Months</MenuItem>
                  <MenuItem value={12}>12 Months</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item sm={6} xs={6} md={6} lg={6}>
              <TextField
                id='HeadCount'
                label='HeadCount'
                type='number'
                value={data.HeadCount}
                onChange={e => {
                  handleOnChange(e)
                }}
                placeholder='Please enter Headcount'
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ width: '100%', m: 1 }}
              />
              <Typography color={'red'} fontSize='12px'>
                {error.HeadCount}
              </Typography>
            </Grid>

            <Grid item sm={6} xs={6} md={6} lg={6}>
              <FormControl sx={{ m: 1 }} variant='outlined' fullWidth>
                <InputLabel htmlFor='SalaryIncrease'>Salary Increase</InputLabel>
                <OutlinedInput
                  id='SalaryIncrease'
                  label='Salary Increase'
                  value={data.SalaryIncrease}
                  type='number'
                  onChange={e => {
                    handleOnChange(e)
                  }}
                  endAdornment={<InputAdornment position='end'>%</InputAdornment>}
                />
              </FormControl>
              <Typography color={'red'} fontSize='12px'>
                {error.SalaryIncrease}
              </Typography>
            </Grid>
            <Grid item sm={6} xs={6} md={6} lg={6}>
              <TextField
                id='AverageLeaveDays'
                label='Average Leave Days'
                type='number'
                value={data.AverageLeaveDays}
                onChange={e => {
                  handleOnChange(e)
                }}
                placeholder='Please Enter Average Leave Days'
                InputLabelProps={{
                  shrink: true
                }}
                sx={{ width: '100%', m: 1 }}
              />
              <Typography color={'red'} fontSize='12px'>
                {error.AverageLeaveDays}
              </Typography>
            </Grid>

            <Grid item sm={12} xs={12} md={12} lg={12}>
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

            {analyticsData ? (
              <Grid item sm={12} xs={12} md={12} lg={12}>
                <Box sx={{ float: 'left' }}>
                  <Typography variant='subtitle2'>Your Projected Annual Leave Liabilities</Typography>
                </Box>

                <Box sx={{ float: 'right', textAlign: 'right' }}>
                  <Typography variant='body2'>${analyticsData.projectedAnnualLeaveLiabilities}</Typography>
                </Box>
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
