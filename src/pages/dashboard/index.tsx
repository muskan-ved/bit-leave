// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Context
import { useAuth } from 'src/hooks/useAuth'

// ** Axios
import axios, { AxiosError } from 'axios'

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

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'
import { AccountAlertOutline, OfficeBuildingOutline } from 'mdi-material-ui'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'
import { BoxProps } from '@mui/material/Box'
import CashoutDialog from './cashout'
// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { useTheme } from '@mui/material/styles'

// ** Icons Imports
import TrendingUp from 'mdi-material-ui/TrendingUp'
import StarOutline from 'mdi-material-ui/StarOutline'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import LockOpenOutline from 'mdi-material-ui/LockOpenOutline'
import { DecimalNumber } from 'aws-sdk/clients/glue'

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    borderRight: `0px solid ${theme.palette.divider}`
  }
}))

let seriesData: number[] = []

let series = [
  {
    name: 'Average Excess Days',
    data: seriesData
  }
]

let departments: string[] = []

type leavesbyOrg = {
  fullname: string
  department: string
  excessDays: number
}

type leavesbyDepartment = {
  department: string
  averageExcessDays: number
}

type team = {
  name: string
  department: string
}

type vitals = {
  averageSalary: number
}

type leaveDetails = {
  cashoutValue: number
  excessDays: number
  valueText: string
}

type profile = {
  id: number,
  fullname: string,
  onboarded: boolean
}

type employee = {
  id: number
  profile: profile
  leaveDetails: leaveDetails
  leavesByOrg: Array<leavesbyOrg>
  leavesByDepartment: Array<leavesbyDepartment>
  team: team
  vitals: vitals
}

const Dashboard = () => {
  // ** Hooks
  const ability = useContext(AbilityContext)
  const { logout } = useAuth()

  const [data, setData] = useState<employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

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
      // labels: {
      //   formatter: val => `${Number(val) / 1000}k`
      // }
    },
    yaxis: {
      labels: { align: theme.direction === 'rtl' ? 'right' : 'left' }
    }
  }

  const [dialogOpen,setDialogOpen]=useState<boolean>(true)
  const handleDialogClose=()=>{
    setDialogOpen(false)
  }
  const fetchData = async () => {
    const userData = localStorage.getItem("userData")
    let employeeId;
    if (userData != null) {
      const data = JSON.parse(userData)
      employeeId = data.id;
    }
    axios
      .get('https://api.bitleave.co/employees/' + employeeId, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        let data = res.data;
        setData(data.data);
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

  useEffect(() => {
    console.log('here');
    if (data) {
      for (let index = 0; index < data.leavesByDepartment.length; index++) {
        departments.push(data.leavesByDepartment[index].department);
      }
      for (let index = 0; index < data.leavesByDepartment.length; index++) {
        series[0].data.push(data.leavesByDepartment[index].averageExcessDays)
      }
    }
  }, [data?.leavesByDepartment]);

  if (isLoading)
    return (<CircularProgress color="success" />)

  if (!isLoading && data && !data.profile.onboarded) {
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
          <Grid item md={5} xs={12}>
            <Card>
              <CardHeader title='Your Leave Details 🗓' subheader={<Divider></Divider>} />
              <CardContent>
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={4}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <CustomAvatar skin='light' variant='rounded' color={'info'} sx={{ mr: 4 }}>
                        <AccountAlertOutline />
                      </CustomAvatar>
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                          {data.leaveDetails.excessDays.toFixed(2)}
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button variant='contained'>Cashout Leave</Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <CardHeader title='Your Team 👪' subheader={<Divider></Divider>} />
              <CardContent>
                <StyledBox>
                  <Box sx={{ py: 1.25, mb: 4, display: 'flex', alignItems: 'center' }}>
                    <OfficeBuildingOutline sx={{ color: 'primary.main', mr: 2.5 }} fontSize='small' />
                    <Typography variant='body2'>Department : {data.team.department} </Typography>
                  </Box>
                  <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                    <AccountOutline sx={{ color: 'primary.main', mr: 2.5 }} fontSize='small' />
                    <Typography variant='body2'>Manager : {data.team.name ? data.team.name : 'No manager assigned'} </Typography>
                  </Box>
                  <br></br>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant='contained'>Link to HRIS</Button>
                  </Box>
                </StyledBox>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <Card>
              <CardHeader title='Salary Details 💲' subheader={<Divider></Divider>} />
              <CardContent>
                <CardStatisticsCharacter
                  data={{
                    stats: `${data.vitals.averageSalary.toFixed(0)}k`,
                    title: '',
                    trend: 'positive',
                    chipColor: 'success',
                    trendNumber: 'in AUD $',
                    chipText: 'Average Salary',
                    src: '/images/cards/card-stats-img-3.png'
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={8} xs={8}>
              <Card>
                <CardHeader title='Average Excess Leaves By Department 📈' subheader={<Divider></Divider>} />
                <CardContent>
                  <ReactApexcharts type='bar' height={294} series={series} options={options} />
                </CardContent>
              </Card>
            </Grid>
          ) : null}
        </Grid>
        <br></br>
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={12} xs={12}>
              <Card>
                <CardHeader title='Leaves By Organisation 📊' subheader={<Divider></Divider>} />
                <CardContent>
                  <Divider></Divider>
                  <Grid item md={12} xs={12}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Initials </TableCell>
                            <TableCell align='center'>Full Name</TableCell>
                            <TableCell align='right'>Department</TableCell>
                            <TableCell align='right'>Excess Days</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.leavesByOrg.map(row => (
                            <TableRow key={row.fullname} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
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
        {/* <CashoutDialog open={dialogOpen} handleClose ={handleDialogClose}></CashoutDialog> */}
      </div>
    )
  }
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
