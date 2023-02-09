// ** React Import
import { useContext, useEffect, useState } from 'react'

// ** MUI import
import { useTheme } from '@mui/material/styles'
import { Box, Button, Card, CardContent, CardHeader, CircularProgress, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'

// ** Custom Components
import TrendsChart from './trendsChart'
import AnnualLeaveByDepartment from './annualLeavesByDepartment'
import AnnualDirectReports from './annualLeavesByDirectReports'
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Types Import
import { employeeType } from 'src/types/dashboard'

// API call
import { loadEmployee } from 'src/store/employee'
import { loadOrganisation } from 'src/store/organisation'

// ** Redux Import
import { useSelector, useDispatch } from 'react-redux'

// ** Redux Store Import
import { RootState, AppDispatch } from 'src/store'

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Util Import
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'
import { getInitials } from 'src/@core/utils/get-initials'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh';

interface QuickStatsType {
  stats: any
  title: string
  icon: string
}

const Stats = () => {

  const [data, setData] = useState<employeeType | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [organisationData, setOrgData] = useState<any>([])
  const [count, setCount] = useState(0)
  const ability = useContext(AbilityContext)

  function currencyFormat(num: any) {
    return '$' + num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const employeeDetails: any = useSelector((state: RootState) => state.employee)

  const dispatch = useDispatch<AppDispatch>()

  const refreshbtn = async () => {
    fetchEmpDataFromRedux()
  }

  const fetchEmpDataFromRedux = async () => {
    setIsLoading(true)
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  const fetchOrganisationData = async () => {
    setIsLoading(true)
    const orgData = await dispatch(loadOrganisation())
    if (orgData.payload != null) {
      setOrgData(orgData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const ReduxCheckEmpData = employeeDetails?.employeeDetail?.data?.leavesByDepartment[0]
    if (
      (ReduxCheckEmpData?.department === null && ReduxCheckEmpData?.averageExcessDays === null) ||
      employeeDetails?.employeeDetail === null
    ) {
      fetchEmpDataFromRedux()
    } else {
      setData(employeeDetails?.employeeDetail?.data)
    }
    if (count != 1) setCount(1)
    fetchOrganisationData()
  }, [])

  const quickStats: QuickStatsType[] = [
    {
      stats: `${currencyFormat(data?.vitals?.averageSalary)}`,
      title: 'Average Salary in AUD',
      icon: '/images/cards/user_icon.png'
    },
    {
      stats: `${currencyFormat(data?.vitals?.totalLeaveLiabilities)}`,
      title: 'Total Leave Liabilities',
      icon: '/images/cards/total_leave_liabilities.png'
    },
    {
      stats: data?.vitals?.headCount,
      title: 'Organisational Headcount',
      icon: '/images/cards/org_headcount.png'
    },
    {
      stats: data?.vitals?.leaveMobilised,
      title: 'Leave Mobilised (Days)',
      icon: '/images/cards/leave_mobilised.png'
    }
  ]

  const theme = useTheme()

  const avgExcessDays: number[] = [],
    departmentsOfAverageExcessDays: string[] = [],
    directReportsOfFullname: string[] = [],
    directReportsOfExcessDays: number[] = []

  if (data) {
    for (let index = 0; index < data?.leavesByDepartment?.length; index++) {
      avgExcessDays.push(Number(data?.leavesByDepartment[index].averageExcessDays?.toFixed(2)))
    }
    for (let index = 0; index < data?.leavesByDepartment?.length; index++) {
      departmentsOfAverageExcessDays.push(data?.leavesByDepartment[index].department)
    }
    for (let index = 0; index < data?.directReports?.length; index++) {
      directReportsOfFullname.push(data?.directReports[index].fullname)
    }
    for (let index = 0; index < data?.directReports?.length; index++) {
      directReportsOfExcessDays.push(Number(data?.directReports[index].excessDays?.toFixed(2)))
    }
  }

  const seriesData: number[] = avgExcessDays ? avgExcessDays : []
  const seriesData1: number[] = directReportsOfExcessDays ? directReportsOfExcessDays : []

  const employees: string[] = directReportsOfFullname
  const departments: string[] = departmentsOfAverageExcessDays

  let totalThresholdsLeave: number[] = []
  const totalThresholdsLeaveWarning: number[] = []

  if (organisationData !== null) {
    totalThresholdsLeave = organisationData[0]?.organisationssettings[0]?.thrleavewarning
      ? organisationData[0]?.organisationssettings[0]?.thrleavewarning
      : 20
    for (let i = 0; i < employees?.length; i++) {
      totalThresholdsLeaveWarning?.push(parseInt(`${totalThresholdsLeave}`, 10))
    }
  }

  const seriesForDirectReports = {
    seriesData1,
    totalThresholdsLeaveWarning
  }

  const optionsForDirectReports = {
    totalThresholdsLeave,
    employees
  }

  const trendsOptions = ['7/12', '8/12', '9/12', '10/12', '11/12', '12/12', '13/12', '14/12', '15/12', '16/12', '17/12', '18/12', '19/12' ]


  const trendsSeries = [
    {
      name: 'Visits',
      data: [100, 120, 90, 170, 130, 160, 140, 240, 220, 180, 270, 280, 375]
    },
    {
      name: 'Clicks',
      data: [60, 80, 70, 110, 80, 100, 90, 180, 160, 140, 200, 220, 275]
    },
    {
      name: 'Sales',
      data: [20, 40, 30, 70, 40, 60, 50, 140, 120, 100, 140, 180, 220]
    }
  ]

  const trendsOptions1 = [ '13/12', '14/12', '15/12', '16/12', '17/12', '18/12', '19/12' ]

  const trendsSeries1 = [
    {
      name: 'Visits',
      data: [100, 120, 140, 180, 270, 280, 375]
    }
  ]

  const renderStats = () => {
    return (
      data &&
      quickStats.map((item: QuickStatsType, index: number) => (
        <>
          <Grid item xs={12} sm={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CustomAvatar src={item.icon} variant='rounded' color={'primary'} sx={{ mr: 4 }} />
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
    )
  }

  if (isLoading && !data) return <CircularProgress color='success' />

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
      </Grid>
    )
  }

  if (!isLoading && data && data?.profile?.onboarded) {
  return (
    <>
    <Grid container spacing={9}>
    <Grid item xs={12} mb={5} sx={{ textAlign: 'right' }}>
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
	  <Grid container spacing={6}>
	  {ability?.can('read', 'analytics') ? (
      <Grid item md={12} xs={12}>
        <Card>
          <CardHeader title='Quick Stats ​​​​​​📊​' subheader={<Divider></Divider>} />
          <CardContent>
            <Grid container spacing={6}>
              {renderStats()}
            </Grid>
          </CardContent>
        </Card>
      </Grid>) : null}
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Trends ​​​​​📈​​' subheader={<Divider></Divider>} />
          <CardContent>
            <TrendsChart options={trendsOptions} series={trendsSeries}/>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Trends ​​​​​📈​​' subheader={<Divider></Divider>} />
          <CardContent>
            <TrendsChart options={trendsOptions1} series={trendsSeries1}/>
          </CardContent>
        </Card>
      </Grid>
	  {data.directReports?.length > 0 || data?.leavesByDepartment?.length > 0 ? 
		(ability?.can('read', 'analytics') ? (
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Average Leaves By Department 📈' subheader={<Divider></Divider>} />
          <CardContent>
            {departments[0] === null || !seriesData ? (
              <Typography variant='body2'>No data to display</Typography>
            ) : (
              <AnnualLeaveByDepartment type='bar' series={seriesData} options={departments ? departments : []} />
            )}
          </CardContent>
        </Card>
      </Grid>): null ): null}
	  {data.directReports?.length > 0 || data?.leavesByDepartment?.length > 0 ? 
      <Grid item md={6} xs={12}>
        <Card>
          <CardHeader title='Leaves by Direct Reports 📈' subheader={<Divider></Divider>} />
          <CardContent>
            {employees[0] === undefined || employees.length < 0 || (!seriesData1 && !totalThresholdsLeaveWarning) ? (
              <Typography variant='body2'>No data to display</Typography>
            ) : (
              <AnnualDirectReports type='line' series={seriesForDirectReports} options={optionsForDirectReports} />
              
            )}
          </CardContent>
        </Card>
      </Grid>
	  : null}

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
                          {data &&
                            data.leavesByOrg.map((row: any, i: number) => (
                              <TableRow key={i} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                                <TableCell component='th' scope='row'>
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
    </>
  )
}
}

Stats.acl = {
	action: 'read',
	subject: 'dashboardStats'
  }
  
export default Stats
