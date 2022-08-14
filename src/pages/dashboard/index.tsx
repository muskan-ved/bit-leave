// ** React Imports
import { SyntheticEvent, useContext, useEffect, useState } from 'react'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

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

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import { employee } from 'src/types/dashboard'

// ** Custom Component Import
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'
import { AccountAlertOutline, BagPersonalOutline, CartArrowRight, ChevronDown, ChevronUp, HomeLightbulbOutline, OfficeBuildingOutline, StoreMarkerOutline } from 'mdi-material-ui'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BoxProps } from '@mui/material/Box'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// // ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// // ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useTheme } from '@mui/material/styles'

// ** Icons Imports
import AccountOutline from 'mdi-material-ui/AccountOutline'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { loadEmployee } from 'src/store/employee'
import CashoutDialog from './cashout'

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `0px solid ${theme.palette.divider}`
  }
}))

const TrophyImg = styled('img')(({ theme }) => ({
  right: 0,
  left: 50,
  bottom: 0,
  width: 40,
  position: 'relative',
  [theme.breakpoints.down('sm')]: {
    width: 10
  }
}))

const Dashboard = () => {

  // ** Hooks
  const ability = useContext(AbilityContext)
  const { logout } = useAuth()

  const [data, setData] = useState<employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [count, setCount] = useState(0);
  const dispatch = useDispatch<AppDispatch>()

  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const handleDialogClose = () => {
    setDialogOpen(false)
  }
  const cashoutLeaveButtonClick = (event: SyntheticEvent) => {
    setDialogOpen(true)
  }
  const takeLeaveButtonClick = (event: SyntheticEvent) => {
    alert('here');
    window.open(data?.profile.hrisLogin)
  }

  const avgExcessDays: number[] = [],
    departmentsOfAverageExcessDays: string[] = [],
    directReportsOfFullname: string[] = [],
    directReportsOfExcessDays: number[] = [];

  if (data) {
    for (let index = 0; index < data?.leavesByDepartment.length; index++) {
      avgExcessDays.push(Number(data?.leavesByDepartment[index].averageExcessDays.toFixed(2)));
    }
    for (let index = 0; index < data?.leavesByDepartment.length; index++) {
      departmentsOfAverageExcessDays.push(data?.leavesByDepartment[index].department);
    }
    for (let index = 0; index < data?.directReports.length; index++) {
      directReportsOfFullname.push(data?.directReports[index].fullname);
    }
    for (let index = 0; index < data?.directReports.length; index++) {
      directReportsOfExcessDays.push(Number(data?.directReports[index].excessDays.toFixed(2)));
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

  const token = localStorage.getItem("accessToken")
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
      toolbar: { show: false },
      id: "muskan"
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

  const fetchDataFromRedux = async () => {
    const userData = localStorage.getItem("userData")
    let employeeId;
    if (userData != null) {
      const data = JSON.parse(userData)
      employeeId = data.id;
    }
    const data = await dispatch(loadEmployee())
    if (data.payload != null) {
      setData(data.payload.data);

    }
    setIsLoading(false)
  }

  useEffect(() => {

    if (!data) {
      setIsLoading(true);
      fetchDataFromRedux();
    }
    if (count != 1)
      setCount(1);
  }, []);

  if (isLoading)
    return (<CircularProgress color="success" />)

  if (!isLoading && data && Object.keys(data.leaveDetails).length == 0) {

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

  if (!isLoading && data && data.profile.onboarded) {
    return (
      <div>
        <Grid container spacing={6}>
          <Grid item md={5} xs={12} >
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
                          {data.leaveDetails.totalDays.toFixed(2)}
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
                          {data.leaveDetails.excessDays.toFixed(2)}
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
                          {data.leaveDetails.cashoutValue.toFixed(2)}k
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
                  <Grid item xs={5} sm={6}>
                    <Box onClick={cashoutLeaveButtonClick} sx={{ display: 'grid', alignItems: 'left' }}>
                      <Button variant='contained'>Cashout Leave</Button>
                    </Box>
                  </Grid>
                  <Grid item xs={5} sm={6}>
                    <Box onClick={takeLeaveButtonClick} sx={{ display: 'grid', alignItems: 'left' }}>
                      <Button variant='contained'>Take Leave</Button>
                    </Box>
                  </Grid>
                </Grid>

              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}  >
            <Card>
              <CardHeader title='Your Team 👪' subheader={<Divider></Divider>} />
              <CardContent>
                <StyledBox>
                  <Box sx={{ py: 1.25, mb: 6, display: 'flex', alignItems: 'center' }}>
                    <OfficeBuildingOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                    <Typography variant='body2'>Department : {data.team.department} </Typography>
                  </Box>
                  <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                    <AccountOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                    <Typography variant='body2'>Manager : {data.team.name ? data.team.name : 'No manager assigned'} </Typography>
                  </Box><br />
                  <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                    <BagPersonalOutline sx={{ color: 'primary.main', mr: 2.5, fontSize: 'small' }} />
                    <Typography variant='body2'>Number Direct Reports : {data.directReports.length} </Typography>
                  </Box>
                </StyledBox>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} xs={6} sm={3}>
            <Card>
              <CardHeader title='Quick Stats' subheader={<Divider></Divider>} />
              <CardContent sx={{ py: 3 }}>
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <TrophyImg alt='Congratulations Daisy' src={`/images/cards/card-stats-img-3.png`} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ mr: 1.75 }}>
                      ${data.vitals.averageSalary.toFixed(0)}k
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='subtitle2' sx={{ color: 'success.main' }}>
                          {/* +12% */}
                        </Typography>
                        {/* <ChevronUp fontSize='small' sx={{ color: 'success.main' }} /> */}
                      </Box>
                    </Box>
                    <Typography variant='body2'>Average Salary in AUD</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider sx={{ my: 0 }} />
              <CardContent sx={{ py: theme => `${theme.spacing(3)} !important` }}>
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <TrophyImg alt='Congratulations Daisy' src={`/images/cards/sales-overview-logo.png`} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ mr: 1.75 }}>
                        {data.vitals.totalLeaveLiabilities.toFixed(2)}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='subtitle2' sx={{ color: 'error.main' }}>
                          {/* -8% */}
                        </Typography>
                        {/* <ChevronDown fontSize='small' sx={{ color: 'error.main' }} /> */}
                      </Box>
                    </Box>
                    <Typography variant='body2'>Total Leave Liabilities (days)</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider sx={{ my: 0 }} />
              <CardContent sx={{ py: theme => `${theme.spacing(3)} !important` }}>
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <TrophyImg alt='Congratulations Daisy' src={`/images/cards/headcount.png`} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ mr: 1.75 }}>
                        {data.vitals.headcount}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='subtitle2' sx={{ color: 'error.main' }}>
                          {/* -8% */}
                        </Typography>
                        {/* <ChevronDown fontSize='small' sx={{ color: 'error.main' }} /> */}
                      </Box>
                    </Box>
                    <Typography variant='body2'>Organisational Headcount</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <Divider sx={{ my: 0 }} />
              <CardContent sx={{ py: theme => `${theme.spacing(3)} !important` }}>
                <Grid container spacing={5}>
                  <Grid item xs={6}>
                    <TrophyImg alt='Congratulations Daisy' src={`/images/cards/trophy.png`} />
                  </Grid>
                  <Grid item xs={6} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                      <Typography variant='h6' sx={{ mr: 1.75 }}>
                        4
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant='subtitle2' sx={{ color: 'error.main' }}>
                          {/* -8% */}
                        </Typography>
                        {/* <ChevronDown fontSize='small' sx={{ color: 'error.main' }} /> */}
                      </Box>
                    </Box>
                    <Typography variant='body2'>Leave Mobilesed (Days)</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={6} xs={8} >
              <Card sx={{ width: '100%' }}>
                <CardHeader title='Average Leaves By Department 📈' subheader={<Divider></Divider>} />
                <CardContent>
                  <ReactApexcharts type='bar' height={294} series={series} options={options} />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          <Grid item md={6} xs={8}  >
            <Card >
              <CardHeader title='Leaves by Direct Reports 📈' subheader={<><Typography variant='body2'>Above the thresholds</Typography><Divider></Divider></>} />
              <CardContent>
                <ReactApexcharts type='scatter' height={294} series={series1} options={options1} />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br></br>
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={12} xs={12}>
              <Card>
                <CardHeader title='Top Leaves By Organisation 📊' subheader={<Divider></Divider>} />
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
                          {data.leavesByOrg.map((row, i) => (
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
                              <TableCell align='right'>{row.excessDays.toFixed(2)}</TableCell>
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
        <CashoutDialog open={dialogOpen} handleClose={handleDialogClose}></CashoutDialog>
      </div>
    )
  }
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
