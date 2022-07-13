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

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Utils Import
import { getInitials } from 'src/@core/utils/get-initials'

// ** Types Imports
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'

// ** Custom Component Import
import CardStatisticsVertical from 'src/@core/components/card-statistics/card-stats-vertical'
import CardStatisticsCharacter from 'src/@core/components/card-statistics/card-stats-with-image'

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
  const {logout} = useAuth()

  const [data, setData] = useState<employee | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const token = localStorage.getItem("accessToken")

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
        setData(data.data)
        setIsLoading(false);
      })
      .catch((reason: AxiosError) => {
        console.log(reason)
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
              <CardHeader title='Your Leave Details' />
              <CardContent>
                <Typography sx={{ mb: 4 }}>Excess Days : {data.leaveDetails.excessDays.toFixed(2)}</Typography>
                <Typography>Cashout Value : ${data.leaveDetails.cashoutValue}</Typography>
                <br />
                <Typography sx={{ color: 'secondary.main' }}>{data.leaveDetails.valueText}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={3} xs={12}>
            <Card>
              <CardHeader title='Your Team' />
              <CardContent>
                <Typography sx={{ mb: 4 }}>Department : {data.team.department}</Typography>
                <Typography>Manager name : {data.team.name}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} xs={12} sm={6}>
            <CardStatisticsCharacter
              data={{
                stats: `${data.vitals.averageSalary.toFixed(0)}k`,
                title: 'Average Salary',
                trend: 'positive',
                chipColor: 'success',
                trendNumber: 'in AUD $',
                chipText: 'Average Excess Days',
                src: '/images/cards/card-stats-img-3.png'
              }}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={12} xs={12}>
              <Card>
                <CardHeader title='Leaves By Organisation' />
                <CardContent>
                  <Grid item md={12} xs={12}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
                        <TableHead>
                          <TableRow>
                            <TableCell>Full Name</TableCell>
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
                                {row.fullname}
                              </TableCell>
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
        <br />
        <Grid container spacing={6}>
          {ability?.can('read', 'analytics') ? (
            <Grid item md={8} xs={8}>
              <Card>
                <CardHeader title='Leaves By Department' />
                <CardContent>
                  <Grid item md={12} xs={6}>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
                        <TableHead>
                          <TableRow>
                            <TableCell align='right'>Department</TableCell>
                            <TableCell align='right'>Average Excess Days</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {data.leavesByDepartment.map(row => (
                            <TableRow key={row.department} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                              <TableCell align='right'>{row.department}</TableCell>
                              <TableCell align='right'>{row.averageExcessDays.toFixed(2)}</TableCell>
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
      </div>
    )
  }
}

Dashboard.acl = {
  action: 'read',
  subject: 'dashboard'
}

export default Dashboard
