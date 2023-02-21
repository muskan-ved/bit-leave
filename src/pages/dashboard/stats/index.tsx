// ** React Import
import { useContext, useEffect, useState } from 'react'

// ** MUI import
import { useTheme } from '@mui/material/styles'
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'

// ** Custom Components
import TrendsChart from './trendsChart'
import AnnualLeaveByDepartment from './annualLeavesByDepartment'
import AnnualDirectReports from './annualLeavesByDirectReports'
import CustomAvatar from 'src/@core/components/mui/avatar'

// API call
import { loadDashboardAnalytics } from 'src/store/employee'
import { loadOrganisation } from 'src/store/organisation'

// ** Redux Import
import { useSelector, useDispatch } from 'react-redux'

// ** Redux Store Import
import { RootState, AppDispatch } from 'src/store'

// ** Util Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh'

interface QuickStatsType {
  stats: any
  title: string
  icon: string
  id: string
}

const Stats = () => {
  const [data, setData] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [organisationData, setOrgData] = useState<any>([])
  const [count, setCount] = useState(0)
  const ability = useContext(AbilityContext)

  function currencyFormat(num: any, includeCents = true) {
    return '$' + num?.toFixed(includeCents ? 2 : 0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const userData = localStorage.getItem('userData')
  let uData
  if (userData != null) {
    uData = JSON.parse(userData)
  }

  const graphHeadTextStyle = {
    float: 'left',
    lineHeight: 1.6,
    fontWeight: 500,
    fontSize: '1.25rem'
  }

  const employeeDetails: any = useSelector((state: RootState) => state.employee)

  const dispatch = useDispatch<AppDispatch>()

  const refreshbtn = async () => {
    fetchEmpDataFromRedux()
  }

  const fetchEmpDataFromRedux = async () => {
    setIsLoading(true)
    const empData = await dispatch(loadDashboardAnalytics())
    if (empData.payload != null) {
      const filterLeavesData = empData.payload.data.pages.filter((p: any) => p.category === 'Stats')
      setData(filterLeavesData[0]?.data)
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
    if (employeeDetails.pages.length === 0) {
      fetchEmpDataFromRedux()
    } else {
      const filterLeavesData = employeeDetails.pages.filter((p: any) => p.category === 'Stats')
      setData(filterLeavesData[0]?.data)
    }
    if (count != 1) setCount(1)
    fetchOrganisationData()
  }, [])

  const quickStats: QuickStatsType[] = [
    {
      stats: `${currencyFormat(data?.averageSalary)}`,
      title: 'Average Salary in AUD',
      icon: '/images/cards/user_icon.png',
      id: 'average_salaryin_aud'
    },
    {
      stats: `${currencyFormat(data?.totalLeaveLiabilities, false)}`,
      title: 'Total Leave Liabilities',
      icon: '/images/cards/total_leave_liabilities.png',
      id: 'total_leave_liabilities'
    },
    {
      stats: data?.headCount,
      title: 'Organisational Headcount',
      icon: '/images/cards/org_headcount.png',
      id: 'organisational_headcount'
    },
    {
      stats: data?.leaveMobilised,
      title: 'Leave Mobilised (Days)',
      icon: '/images/cards/leave_mobilised.png',
      id: 'leave_mobilised(days)'
    }
  ]

  const theme = useTheme()

  const avgExcessDays: number[] = [],
    departmentsOfAverageExcessDays: string[] = [],
    directReportsOfFullname: string[] = [],
    directReportsOfExcessDays: number[] = [],
    seriesDataForLeavesByUnassigned: number[] = [],
    optionsDataForLeavesByUnassigned: string[] = [],
    seriesDataForLiabilityTrends: number[] = [],
    optionsDataForLiabilityTrends: string[] = []

  if (data) {
    for (let index = 0; index < data?.leavesByDepartment?.length; index++) {
      avgExcessDays.push(Number(data?.leavesByDepartment[index].excessDays?.toFixed(2)))
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
    for (let index = 0; index < data?.leavesByUnassigned?.length; index++) {
      optionsDataForLeavesByUnassigned.push(data?.leavesByUnassigned[index].fullname)
    }
    for (let index = 0; index < data?.leavesByUnassigned?.length; index++) {
      seriesDataForLeavesByUnassigned.push(Number(data?.leavesByUnassigned[index].excessDays?.toFixed(2)))
    }
    for (let index = 0; index < data?.liabilityTrends?.length; index++) {
      optionsDataForLiabilityTrends.push(data?.liabilityTrends[index].month)
    }
    for (let index = 0; index < data?.liabilityTrends?.length; index++) {
      seriesDataForLiabilityTrends.push(Number(data?.liabilityTrends[index].leaveLiability?.toFixed(2)))
    }
  }

  let totalThresholdsLeave: number[] = []
  const totalThresholdsLeaveWarning: number[] = []

  if (organisationData !== null) {
    totalThresholdsLeave = organisationData[0]?.organisationssettings[0]?.thrleavewarning
      ? organisationData[0]?.organisationssettings[0]?.thrleavewarning
      : 20
    for (let i = 0; i < directReportsOfFullname?.length; i++) {
      totalThresholdsLeaveWarning?.push(parseInt(`${totalThresholdsLeave}`, 10))
    }
  }

  const renderStats = () => {
    return (
      data &&
      quickStats.map((item: QuickStatsType, index: number) => (
        <Grid item xs={12} sm={3} key={item.id}>
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
      ))
    )
  }

  if (isLoading && !data) return <CircularProgress color='success' />

  if (!isLoading && data && !uData?.userOnboarded) {
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

  if (!isLoading && data && uData?.userOnboarded) {
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
                <CardHeader
                  title={
                    <>
                      <Typography component={'span'} sx={graphHeadTextStyle}>
                        Quick Stats
                      </Typography>{' '}
                      <Avatar
                        src='/images/cards/quickStats.png'
                        sx={{ borderRadius: 0, padding: '1px', position: 'relative', top: '-7px' }}
                      />
                    </>
                  }
                  subheader={<Divider></Divider>}
                />
                <CardContent>
                  <Grid container spacing={6}>
                    {renderStats()}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {data.liabilityTrends?.length > 0 ? (
            <Grid item md={6} xs={12}>
              <Card>
                <CardHeader
                  title={
                    <>
                      <Typography component={'span'} sx={graphHeadTextStyle}>
                        Leave Liability Trends
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
          {data.directReports?.length > 0 || data?.leavesByDepartment?.length > 0 ? (
            ability?.can('read', 'analytics') ? (
              <Grid item md={6} xs={12}>
                <Card>
                  <CardHeader
                    title={
                      <>
                        <Typography component={'span'} sx={graphHeadTextStyle}>
                          Average Leave By Department
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
                    {departmentsOfAverageExcessDays[0] === null || !avgExcessDays ? (
                      <Typography variant='body2'>No data to display</Typography>
                    ) : (
                      <AnnualLeaveByDepartment
                        type='bar'
                        series={avgExcessDays}
                        options={departmentsOfAverageExcessDays ? departmentsOfAverageExcessDays : []}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ) : null
          ) : null}
          {data.directReports?.length > 0 ? (
            <Grid item md={6} xs={12}>
              <Card>
                <CardHeader
                  title={
                    <>
                      <Typography component={'span'} sx={graphHeadTextStyle}>
                        Leave by Direct Reports
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
                  {directReportsOfFullname[0] === undefined ||
                  directReportsOfFullname.length < 0 ||
                  (!directReportsOfExcessDays && !totalThresholdsLeaveWarning) ? (
                    <Typography variant='body2'>No data to display</Typography>
                  ) : (
                    <AnnualDirectReports
                      type='scatter'
                      series={directReportsOfExcessDays}
                      options={directReportsOfFullname}
                      seriesThresholds={totalThresholdsLeaveWarning}
                      optionsThresholds={totalThresholdsLeave}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : null}
          {data.leavesByUnassigned?.length > 0 ? (
            <Grid item md={6} xs={12}>
              <Card>
                <CardHeader
                  title={
                    <>
                      <Typography component={'span'} sx={graphHeadTextStyle}>
                        Leave by Unassigned Employee
                      </Typography>{' '}
                      <Avatar
                        src='/images/cards/unassigned.png'
                        sx={{ borderRadius: 0, position: 'relative', padding: '7px', top: '-8px' }}
                      />
                    </>
                  }
                  subheader={<Divider></Divider>}
                />
                <CardContent>
                  {optionsDataForLeavesByUnassigned[0] === undefined ||
                  seriesDataForLeavesByUnassigned.length < 0 ||
                  !seriesDataForLeavesByUnassigned ? (
                    <Typography variant='body2'>No data to display</Typography>
                  ) : (
                    <AnnualDirectReports
                      type='scatter'
                      series={seriesDataForLeavesByUnassigned}
                      options={optionsDataForLeavesByUnassigned}
                      seriesThresholds={totalThresholdsLeaveWarning}
                      optionsThresholds={totalThresholdsLeave}
                    />
                  )}
                </CardContent>
              </Card>
            </Grid>
          ) : null}

          {ability?.can('read', 'analytics') ? (
            <Grid item md={12} xs={12}>
              <Card>
                <CardHeader
                  title={
                    <>
                      <Typography component={'span'} sx={graphHeadTextStyle}>
                        Top Annual Leave Balances In The Organisation
                      </Typography>{' '}
                      <Avatar
                        src='/images/cards/annualLeave.png'
                        sx={{ borderRadius: 0, position: 'relative', padding: '7px', top: '-8px' }}
                      />
                    </>
                  }
                  subheader={<Divider></Divider>}
                />
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
                          {data && data.directReports.length > 0 ? (
                            data.directReports.map((row: any, i: number) => (
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
                            ))
                          ) : (
                            <TableRow>
                              <TableCell align='center' colSpan={4}>
                                No record found
                              </TableCell>
                            </TableRow>
                          )}
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
