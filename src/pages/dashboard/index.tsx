// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableRow from '@mui/material/TableRow'
import TableHead from '@mui/material/TableHead'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import { employeeType } from 'src/types/dashboard'

// ** Custom Component Import
import { AccountAlertOutline, BagPersonalOutline, HomeLightbulbOutline, OfficeBuildingOutline } from 'mdi-material-ui'
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { BoxProps } from '@mui/material/Box';

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts';

// // ** Third Party Imports
import { ApexOptions } from 'apexcharts';

// // ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba';
import { useTheme } from '@mui/material/styles';

// ** Icons Import
import AccountOutline from 'mdi-material-ui/AccountOutline';

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh';

// ** Redux Import
import { useSelector, useDispatch } from 'react-redux';

// ** Redux Store Import
import { RootState, AppDispatch } from 'src/store';
import { loadEmployee } from 'src/store/employee';

// ** Modal Import
import CashoutDialog from './cashout';

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `0px solid ${theme.palette.divider}`
  }
}))

interface QuickStatsType {
  stats: any
  title: string
  icon: string
}

const Dashboard = () => {

  // ** Hooks
  const ability = useContext(AbilityContext)
  const [data, setData] = useState<employeeType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [count, setCount] = useState(0);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const dispatch = useDispatch<AppDispatch>()
  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  const cashoutLeaveButtonClick = () => {
    setDialogOpen(true)
  }
  const takeLeaveButtonClick = () => {
    window.open(data?.profile.hrisLogin)
  }

  const avgExcessDays: number[] = [],
    departmentsOfAverageExcessDays: string[] = [],
    directReportsOfFullname: string[] = [],
    directReportsOfExcessDays: number[] = [];

  if (data) {
    for (let index = 0; index < data?.leavesByDepartment?.length; index++) {
      avgExcessDays.push(Number(data?.leavesByDepartment[index].averageExcessDays?.toFixed(2)));
    }
    for (let index = 0; index < data?.leavesByDepartment?.length; index++) {
      departmentsOfAverageExcessDays.push(data?.leavesByDepartment[index].department);
    }
    for (let index = 0; index < data?.directReports?.length; index++) {
      directReportsOfFullname.push(data?.directReports[index].fullname);
    }
    for (let index = 0; index < data?.directReports?.length; index++) {
      directReportsOfExcessDays.push(Number(data?.directReports[index].excessDays?.toFixed(2)));
    }
  }

  const seriesData: number[] = avgExcessDays;
  const seriesData1: number[] = directReportsOfExcessDays;
  const series = [
    {
      name: 'Average Excess Days',
      data: seriesData
    }
  ]
  const series1 = [
    {
      name: 'Average Excess Days By Employee',
      data: seriesData1
    }
  ]
  const employees: string[] = directReportsOfFullname
  const departments: string[] = departmentsOfAverageExcessDays;
  const theme = useTheme()

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded'
      }
    },
    grid: {
      strokeDashArray: 8,
      xaxis: {
        lines: { show: true },

      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -18,
        left: 26,
        right: 50,
        bottom: 6
      }
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 1),
      hexToRGBA(theme.palette.success.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.error.light, 1)
    ],
    legend: { show: false },
    states: {
      hover: {
        filter: { type: 'none' }
      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: departments,
    },
    yaxis: {
      labels: { align: theme.direction === 'rtl' ? 'right' : 'left' }
    }
  }

  const options1: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        barHeight: '60%',
        horizontal: true,
        distributed: true,
        startingShape: 'rounded'
      }
    },
    grid: {
      strokeDashArray: 8,
      xaxis: {
        lines: { show: true }
      },
      yaxis: {
        lines: { show: false }
      },
      padding: {
        top: -18,
        left: 26,
        right: 50,
        bottom: 6
      }
    },
    colors: [
      hexToRGBA(theme.palette.primary.light, 1),
      hexToRGBA(theme.palette.success.light, 1),
      hexToRGBA(theme.palette.warning.light, 1),
      hexToRGBA(theme.palette.info.light, 1),
      hexToRGBA(theme.palette.error.light, 1)
    ],
    states: {
      hover: {
        filter: { type: 'none' }

      },
      active: {
        filter: { type: 'none' }
      }
    },
    xaxis: {
      axisTicks: { show: false },
      axisBorder: { show: false },
      categories: employees,
    },
    yaxis: {
      labels: { align: theme.direction === 'rtl' ? 'right' : 'left' }
    },
  }


  const employeeDetails = useSelector((state: RootState) => state.employee);

  const refreshbtn = async () => {
    fetchDataFromRedux()
  }

  const fetchDataFromRedux = async () => {
    setIsLoading(true);
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const ReduxCheckEmpData = employeeDetails?.employeeDetail?.data?.leavesByDepartment[0];
    if (ReduxCheckEmpData?.department === null && ReduxCheckEmpData?.averageExcessDays === null || employeeDetails?.employeeDetail === null) {
      fetchDataFromRedux();
    }else{
      setData(employeeDetails?.employeeDetail?.data)
    }
    if (count != 1)
      setCount(1);
  }, []);


  const quickStats: QuickStatsType[] = [
    {
      stats: `$${data?.vitals?.averageSalary?.toFixed(0)}k`, 
      title: 'Average Salary in AUD',
      icon: "/images/cards/user_icon.png"
    },
    {
      stats: `$${data?.vitals?.totalLeaveLiabilities?.toFixed(2)}`,
      title: 'Total Leave Liabilities',
      icon: "/images/cards/total_leave_liabilities.png"
    },
    {
      stats: data?.vitals?.headCount,
      title: 'Organisational Headcount',
      icon: "/images/cards/org_headcount.png"
    },
    {
      stats: `${data?.vitals?.leaveMobilised}`,
      title: 'Leave Mobilised (Days)',
      icon: "/images/cards/leave_mobilised.png"
    }
  ]

  if (isLoading && !data)
    return (<CircularProgress color="success" />)

  if (!isLoading && data && Object.keys(data.leaveDetails)?.length == 0) {
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

  const renderStats = () => {
    return data && quickStats.map((item: QuickStatsType, index: number) => (
      <>
      <Grid item xs={12} sm={3} key={index}>
        <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
          <CustomAvatar src={item.icon}  variant='rounded' color={'primary'} sx={{ mr: 4 }}/>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='h6' sx={{ fontWeight: 600 }}>
            {item.stats}
            </Typography>
            <Typography variant='caption'>{item.title}</Typography>
          </Box>
        </Box>
      </Grid>

    </>
    ))
  }

  if (!isLoading && data  && data?.profile?.onboarded ) {
    return (
      <>
         <Grid container spacing={9}>
            <Grid item xs={12} mb={5} sx={{textAlign:"right"}}>
            <Box sx={{maxWidth: 'inherit'}}>
              <Button variant='contained' onClick={refreshbtn} disabled={isLoading}> 
                  <RefreshIcon sx={{fontSize: '1.1rem',mr:'4px'}}/>Refresh
              </Button>
            </Box>
            <Divider></Divider>
            </Grid>
          </Grid>
          {ability?.can('read', 'analytics') ? (
          <Grid container spacing={6}>
    
            <Grid item md={9} xs={12}>
              <Card>
                <CardHeader title='Quick Stats ​​​​​​📊​' subheader={<Divider></Divider>}  />
                <CardContent>
                  <Grid container spacing={6}>
                    {renderStats()}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
                  <Grid item md={3} xs={12} sx={{display:"inline-grid"}} >
                  <Card>
                    <CardHeader title='Your Details 👨‍💼' subheader={<Divider></Divider>} />
                    <CardContent>
                      <StyledBox>
                        <Box sx={{  mb: 3, display: 'flex', alignItems: 'center' }}>
                          <OfficeBuildingOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                          <Typography variant='body2'>Job title : {data.profile.jobtitle} </Typography>
                        </Box>
                        <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                          <AccountOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                          <Typography variant='body2'>Country : {data.profile.country} </Typography>
                        </Box>                 
                      </StyledBox>
                    </CardContent>
                  </Card>
                </Grid>
                </Grid>):null}
          <br />
        <Grid container spacing={6}>
          <Grid item md={7} xs={12} >
            <Card>
              <CardHeader title='Your Leave Details 🗓' subheader={<Divider></Divider>} />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' variant='rounded' color={'info'} sx={{ mr: 4 }}>
                        <HomeLightbulbOutline />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                          {data.leaveDetails.totalDays?.toFixed(2)}
                        </Typography>
                        <Typography variant='caption'>Total Days</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' variant='rounded' color={'error'} sx={{ mr: 4 }}>
                        <AccountAlertOutline />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                          {data.leaveDetails.excessDays?.toFixed(2)}
                        </Typography>
                        <Typography variant='caption'>Excess Days</Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' variant='rounded' color={'success'} sx={{ mr: 4 }}>
                        <CurrencyUsd />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                          {data.leaveDetails.cashoutValue?.toFixed(2)}k
                        </Typography>
                        <Typography variant='caption'>Cashout Value</Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <br></br>
                <Divider></Divider>
                <Typography sx={{ color: 'secondary.main' }}>{data.leaveDetails.valueText}</Typography>
                <br></br>
                <Grid container spacing={1}>
                  <Grid item xs={4} sm={4}>
                    <Box  sx={{ display: 'grid', alignItems: 'left' }}>
                      <Button variant='contained' onClick={cashoutLeaveButtonClick} disabled={!data.leaveDetails.canCashoutLeave} >Cashout Leave</Button>
                    </Box>
                  </Grid>
                  <Grid item xs={4} sm={4}>
                    <Box  sx={{ display: 'grid', alignItems: 'left' }}>
                      <Button variant='contained' onClick={takeLeaveButtonClick}>Take Leave</Button>
                    </Box>
                  </Grid>
                  {/* data.leaveDetails.totalDays */}
                   <Grid item xs={4} sm={4}>
                    <Box  sx={{ display: 'grid', alignItems: 'left' }}>
                      <Button variant='contained' onClick={cashoutLeaveButtonClick} disabled>Cashout Bit.Leave</Button>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={5} xs={12} sx={{display:"inline-grid"}} >
            <Card>
              <CardHeader title='Your Team 👪' subheader={<Divider></Divider>} />
              <CardContent>
                <StyledBox>
                  <Box sx={{ py: 1.25, mb: 6, display: 'flex', alignItems: 'center' }}>
                    <OfficeBuildingOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                    <Typography variant='body2'>Department : {data.profile.department} </Typography>
                  </Box>
                  <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                    <AccountOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                    <Typography variant='body2'>Manager : {data.profile.managerName ? data.profile.managerName : 'No manager assigned'} </Typography>
                  </Box><br />
                  <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                    <BagPersonalOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                    <Typography variant='body2'>Number Direct Reports : {data.directReports?.length} </Typography>
                  </Box>
                </StyledBox>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={12} xs={12}>
              <Card>
                <CardHeader title='Top Annual Leave Balances In The Organisation 📊' subheader={<Divider></Divider>} />
                <CardContent>
                  <Divider></Divider>
                  <Grid item md={12} xs={12}>
                    <TableContainer component={Paper}>
                      <Table aria-label='a dense table' sx={{ minWidth: 650, size: 'small' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell>Initials </TableCell>
                            <TableCell align='center'>Full Name</TableCell>
                            <TableCell align='right'>Department</TableCell>
                            <TableCell align='right'>Total Days</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data && data.leavesByOrg.map((row: any, i: number) => (
                            <TableRow key={i} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                              <TableCell component='th' scope='row' >
                                <CustomAvatar
                                  skin='light'
                                  color={'primary'}
                                  sx={{ mr: 3, fontSize: '.8rem', width: '1.875rem', height: '1.875rem' }}
                                >
                                  {getInitials(row.fullname)}
                                </CustomAvatar>
                              </TableCell>
                              <TableCell align='center'>{row.fullname}</TableCell>
                              <TableCell align='right'>{row.department}</TableCell>
                              <TableCell align='right'>{row.excessDays?.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ) : null}
        </Grid>
        <br></br>
        {data.directReports?.length > 0 && data?.leavesByDepartment?.length > 0 ?(
        <Grid container spacing={6} >
          {ability?.can('read', 'analytics') ? (
            <Grid item md={6} xs={12} >
              <Card sx={{ width: '100%' }}>
                <CardHeader title='Average Leaves By Department 📈' subheader={<Divider></Divider>} />
                <CardContent>
                  <ReactApexcharts type='bar' height={294} series={series} options={options} />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          <Grid item md={6} xs={12}  >
            <Card >
              <CardHeader title='Leaves by Direct Reports 📈' subheader={<><Typography variant='body2'>Above the thresholds</Typography><Divider></Divider></>} />
              <CardContent>
                <ReactApexcharts type='scatter' height={294} series={series1} options={options1} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>):null}
        
        <CashoutDialog open={dialogOpen} handleClose={handleDialogClose}></CashoutDialog>
      </>
    )
  }
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
