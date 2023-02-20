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

// ** React Import
import { useEffect, useState } from 'react'

// ** Redux Import
import { useSelector, useDispatch } from 'react-redux'

// ** Redux Store Import
import { RootState, AppDispatch } from 'src/store'
import { loadDashboardAnalytics } from 'src/store/employee'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh';

// ** Import other page
import CashoutDialog from '../cashout'
import * as gtag from '../../../lib/gtag'
import Link from 'next/link'
import { useTheme } from '@mui/material/styles'

const Leaves = () => {

  const [data, setData] = useState<any | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  
  const employeeDetails: any = useSelector((state: RootState) => state.employee)
  const theme = useTheme()
  const userData = localStorage.getItem("userData")
  let uData;
  if (userData != null) {
     uData = JSON.parse(userData)
  }

  const refreshbtn = async () => {
    fetchEmpData()
  }

  const fetchEmpData = async () => {
      setIsLoading(true)
    const empData = await dispatch(loadDashboardAnalytics())
  
    if (empData.payload != null) {
      const filterLeavesData  = empData.payload.data.pages.filter((p:any) => p.category === 'MyLeaves')
      setData(filterLeavesData[0].data)
      setIsLoading(false)
    }
    setIsLoading(false)
}
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {

    if (employeeDetails?.pages.length === 0 ) {
      fetchEmpData()
    } else {
      const filterLeavesData  = employeeDetails.pages.filter((p:any) => p.category === 'MyLeaves')
      setData(filterLeavesData[0].data)
    }
  }, [])


  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  const cashoutLeaveButtonClick = () => {
    setDialogOpen(true)
    gtag.event({
      action: 'cashout_leave',
      category: 'dashboard',
      label: 'cashout_leave',
      value: 'modal'
    })
  }

  function currencyFormat(num: any) {
    return '$' + num?.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
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
        <Grid item md={12} xs={12}>
          <Card>
            <CardHeader title='My Leave Details 📆​' subheader={<Divider></Divider>} />
            <CardContent>
              <Grid item md={12} xs={12}>
                <TableContainer component={Paper}>
                  <Table aria-label='a dense table' sx={{ minWidth: 650, size: 'small' }}>
                    <TableBody>
                      {data.map((item:any,i:number) => { 
                        return (

                      <TableRow key={i} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                        <TableCell component='th' scope='row'>
                          {item.name}
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
                                  {item?.totalDays?.toFixed(2)}
                                </Typography>
                                <Typography variant='h6' sx={{ fontWeight: 600, mr: 4, mb: 7 }}>
                                  {item?.excessDays?.toFixed(2)}
                                </Typography>
                                <Typography variant='h6' sx={{ fontWeight: 600, mr: 4 }}>
                                  {/* {data?.leaveDetails?.cashoutValue
                                    ? currencyFormat(data?.leaveDetails?.cashoutValue)
                                    : '0'} */}
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
                          <Grid container spacing={4}>
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
                              <Box sx={{ display: 'flex', flexDirection: 'row' }}>

                                {item.isCashable ?
                                <Button variant='contained' onClick={cashoutLeaveButtonClick}
                                  disabled={!item.canCashoutLeave} sx={{color:`rgba(${'0,0,0'}, 0.87) !important`}}>
                                  Cashout Leave
                                </Button> : '' }
                           
                                <Button component='a' variant='contained' sx={{ ml: 5,color:`rgba(${'0,0,0'}, 0.87) !important` }} target='_blank' href={item.applyLink} >
                                  Take Leave
                                </Button>
                              
                              </Box>
                            </Grid>
                          </Grid>
                          </TableCell>
                      </TableRow>
                      )})}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <CashoutDialog open={dialogOpen} handleClose={handleDialogClose}></CashoutDialog>
      </>
    )
  }
}

Leaves.acl = {
	action: 'read',
	subject: 'dashboard'
  }

export default Leaves
