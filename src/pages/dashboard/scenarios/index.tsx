// ** Icons Imports
import {
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
import LoadingButton from '@mui/lab/LoadingButton';

// ** Imports react
import { useEffect, useState } from 'react'
import { useDispatch ,useSelector} from 'react-redux'

// ** Import redux store
import { AppDispatch, RootState } from 'src/store';
import { loadEmployee, loadDashboardAnalytics } from 'src/store/employee';

//  ** Import Toaster
import { toast,ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const Scenarios = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [analyticsData, setAnalyticsData] = useState<boolean>(false)
  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const [data, setData] = useState<any>({
    Headcount: '',
    AverageSalary:''
  })

  const [error, setError] = useState<any>({
    Headcount: '',
    AverageSalary: ''
  })

  const dispatch = useDispatch<AppDispatch>()
  const employeeDetails:any = useSelector((state: RootState) => state.employee)

  const refreshbtn = async () => {
    fetchDataFromRedux()
  }

  const fetchDataFromRedux = async () => {
    setIsLoading(true)
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setData({
        Headcount: empData.payload.data.vitals.headCount,
        AverageSalary:empData.payload.data.vitals.averageSalary
      })
      setIsLoading(false)
    }else{
      toast.error('Unfortunately, there was an issue to load the data, please try again later')
    }
    setIsLoading(false)
  }

    useEffect(() => {
      const ReduxCheckEmpData = employeeDetails?.employeeDetail?.data?.leavesByDepartment[0]
      if (
        (ReduxCheckEmpData?.department === null && ReduxCheckEmpData?.averageExcessDays === null) ||
        employeeDetails?.employeeDetail === null
      ) {
        fetchDataFromRedux()
      } else {
        setData({
          Headcount: employeeDetails?.employeeDetail?.data.vitals.headCount,
          AverageSalary:employeeDetails?.employeeDetail?.data.vitals.averageSalary
        })
      }
    }, [])
  

  const handleOnChange = async (e: any) => {
    const targetValue = e.target.value
    const targetId = e.target.id

    if (targetValue.includes('-') || targetValue === '0') {
      setError({ [targetId]: '' })
      setData({ [targetId]: '1' })
    } else if (targetValue === '') {
      setError({ [targetId]: `${targetId} is required` })
      setData({ [targetId]: targetValue })
    } else {
      setError({ [targetId]: '' })
      setData({ [targetId]: targetValue })
    }
  }

  const handleSubmit = async (e: any) => {
    
		setSubmitLoading(true)
		const data = await dispatch(loadDashboardAnalytics())
    if (data.payload != null) {
      setAnalyticsData(data.payload.data)
      setSubmitLoading(false)
    }
		setSubmitLoading(false)
  }

  if (isLoading && !data.Headcount && !data.AverageSalary) return <CircularProgress color='success' />

  return (
    <>
    <ToastContainer/>
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
          <Card >
            <CardHeader title='Scenarios ​​​​​📈​​' subheader={<Divider></Divider>}/>
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
                    placeholder='Please enter headcount'
                    InputLabelProps={{
                      shrink: true
                    }}
                    sx={{width:'100%'}}
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
                    sx={{width:'100%'}}

                  />
                  <Typography color={'red'}>{error.AverageSalary}</Typography>
                </Grid>
                <Grid item xs={12} md={2} lg={2} sx={{ mt: 5 }}>
                  {!submitLoading ? <Button variant='contained' size='large' onClick={handleSubmit} sx={{p:'14.8px 70px !important'}}>Apply</Button>:
                   <LoadingButton variant='contained' loading={submitLoading} size='large' disabled sx={{p:'14.8px 70px !important'}}>Apply</LoadingButton>}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        <Grid item xs={12} md={12}>
        </Grid>
    </>
  )
}

Scenarios.acl = {
  action: 'read',
  subject: 'dashboardScenarios'
}

export default Scenarios