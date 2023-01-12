// ** MUI import
import {
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
import { AccountAlertOutline, HomeLightbulbOutline } from 'mdi-material-ui'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'

// ** Types Import
import { employeeType } from 'src/types/dashboard'

// ** React Import
import { useEffect, useState } from 'react'

// ** Redux Import
import { useSelector, useDispatch } from 'react-redux'

// ** Redux Store Import
import { RootState, AppDispatch } from 'src/store'
import { loadEmployee } from 'src/store/employee'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'


const Leaves = () => {

  const [data, setData] = useState<employeeType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  
  const employeeDetails: any = useSelector((state: RootState) => state.employee)
  
  const fetchEmpData = async () => {
      setIsLoading(true)
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
}
const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const ReduxCheckEmpData = employeeDetails?.employeeDetail?.data?.leavesByDepartment[0]
    if (
      (ReduxCheckEmpData?.department === null && ReduxCheckEmpData?.averageExcessDays === null) ||
      employeeDetails?.employeeDetail === null
    ) {
      fetchEmpData()
    } else {
      setData(employeeDetails?.employeeDetail?.data)
    }
  }, [])

  function currencyFormat(num: any) {
    return '$' + num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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
      <Grid container spacing={6}>
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader title='My Leave Details 📆​' subheader={<Divider></Divider>} />
            <CardContent>
              <Divider></Divider>
              <Grid item md={12} xs={12}>
                <TableContainer component={Paper}>
                  <Table aria-label='a dense table' sx={{ minWidth: 650, size: 'small' }}>
                    <TableHead>
                      <TableRow>
                        <TableCell align='left'>Leave Type </TableCell>
                        <TableCell align='left'>Days Available</TableCell>
                        <TableCell align='left'>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                        <TableCell component='th' scope='row'>
                          Annual Leave Balance (as of X date)
                        </TableCell>
                        <TableCell align='right'>
                          <Grid container spacing={6}>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexBasis: '100% !important',
                                maxWidth: '100% !important'
                              }}
                            >
                              <Box>
                                <CustomAvatar skin='light' variant='rounded' color={'info'} sx={{ mr: 4, mb: 4 }}>
                                  <HomeLightbulbOutline />
                                </CustomAvatar>
                                <CustomAvatar skin='light' variant='rounded' color={'error'} sx={{ mr: 4, mb: 4 }}>
                                  <AccountAlertOutline />
                                </CustomAvatar>
                                <CustomAvatar skin='light' variant='rounded' color={'success'} sx={{ mr: 4 }}>
                                  <CurrencyUsd />
                                </CustomAvatar>
                              </Box>

                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Typography variant='h6' sx={{ fontWeight: 600, mr: 4, mb: 7 }}>
                                  {data.leaveDetails.totalDays?.toFixed(2)}
                                </Typography>
                                <Typography variant='h6' sx={{ fontWeight: 600, mr: 4, mb: 7 }}>
                                  {data.leaveDetails.excessDays?.toFixed(2)}
                                </Typography>
                                <Typography variant='h6' sx={{ fontWeight: 600, mr: 4 }}>
                                  {data?.leaveDetails?.cashoutValue
                                    ? currencyFormat(data?.leaveDetails?.cashoutValue)
                                    : '0'}
                                </Typography>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                                <Typography variant='caption' sx={{ mr: 4, mb: 12, width: '100%', mt: 2 }}>
                                  Total Days
                                </Typography>
                                <Typography variant='caption' sx={{ mr: 4, mb: 10, width: '100%' }}>
                                  Excess Days
                                </Typography>
                                <Typography variant='caption' sx={{ mr: 4, width: '100%' }}>
                                  Cashout Value
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell align='right'>
                          <Grid container spacing={6}>
                            <Grid
                              item
                              xs={12}
                              sm={4}
                              sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                flexBasis: '100% !important',
                                maxWidth: '100% !important'
                              }}
                            >
                              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                <Button variant='contained' disabled sx={{ mb: 5, mt: 2 }} >
                                  Cashout Leave
                                </Button>

                                <Button variant='contained' disabled sx={{ mb: 5 }}>
                                  Take Leave
                                </Button>
                                <Button variant='contained' disabled>
                                  Cashout Bit.Leave
                                </Button>
                              </Box>
                            </Grid>
                          </Grid>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

Leaves.acl = {
	action: 'read',
	subject: 'dashboard'
  }

export default Leaves
