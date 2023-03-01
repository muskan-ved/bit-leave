// ** MUI import
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
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import { loadDashboardAnalytics, loadEmployee } from 'src/store/employee'

// ** Custom Components
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Icons Imports
import RefreshIcon from '@mui/icons-material/Refresh'

// ** Import other page
import CashoutDialog from '../cashout'
import * as gtag from '../../../lib/gtag'

const Leaves = () => {
  const [data, setData] = useState<any | []>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)
  const [employeeData, setemployeeData] = useState<any>('')
  const [orgName, setOrgName] = useState<any>('')

  const employeeDetails: any = useSelector((state: RootState) => state.employee)
  const userData = localStorage.getItem('userData')
  let uData
  if (userData != null) {
    uData = JSON.parse(userData)
  }

  const refreshbtn = async () => {
    fetchEmpData()
  }

  const fetchUserData = async () => {
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setemployeeData(empData.payload.data)
      setOrgName(empData?.payload?.data?.orgs[0]?.name)
    }
    setIsLoading(false)
  }

  const fetchEmpData = async () => {
    setIsLoading(true)
    const empData = await dispatch(loadDashboardAnalytics())

    if (empData.payload != null) {
      const filterLeavesData = empData.payload.data.pages.filter((p: any) => p.category === 'MyLeaves')
      setData(filterLeavesData[0].data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if (employeeDetails?.pages.length === 0) {
      fetchEmpData()
    } else {
      const filterLeavesData = employeeDetails.pages.filter((p: any) => p.category === 'MyLeaves')
      setData(filterLeavesData[0].data)
    }
    fetchUserData()
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
    return '$' + num?.toFixed().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const handleChange = (event: SelectChangeEvent) => {
    setOrgName(event.target.value)
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
          <Grid item xs={12} mb={5}>
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
                  return <MenuItem key={itemorg.id} value={itemorg.name}>{itemorg.name}</MenuItem>
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
        <Grid container spacing={6}>
          <Grid item md={12} xs={12}>
            <Card>
              <CardHeader
                title={
                  <>
                    <Typography
                      component={'span'}
                      sx={{ float: 'left', lineHeight: 1.6, marginRight: '10px', fontWeight: 500, fontSize: '1.25rem' }}
                    >
                      My Leave Details
                    </Typography>{' '}
                    <Avatar
                      src='/images/cards/calendar.png'
                      sx={{ borderRadius: 0, position: 'relative', padding: '5px', top: '-8px' }}
                    />
                  </>
                }
                subheader={<Divider></Divider>}
              />
              <CardContent>
                <Grid item md={12} xs={12}>
                  <TableContainer component={Paper}>
                    <Table aria-label='a dense table' sx={{ minWidth: 650, size: 'small' }}>
                      <TableBody>
                        {data.map((item: any, i: number) => {
                          return (
                            <TableRow key={i} sx={{ '&:last-of-type  td, &:last-of-type  th': { border: 0 } }}>
                              <TableCell component='th' scope='row'>
                                {item.name}
                              </TableCell>
                              <TableCell align='right'>
                                <Grid container spacing={6}>
                                  <Grid item xs={12} sm={4} sx={{ justifyContent: 'right' }}>
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                      <CustomAvatar skin='light' variant='rounded' color={'info'} sx={{ mr: 4 }}>
                                        <HomeLightbulbOutline />
                                      </CustomAvatar>
                                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                        <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                          {item?.totalDays}
                                        </Typography>
                                        <Typography variant='caption'>Days</Typography>
                                      </Box>
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                      {item.isCashable ? (
                                        <>
                                          {' '}
                                          <CustomAvatar skin='light' variant='rounded' color={'error'} sx={{ mr: 4 }}>
                                            <AccountAlertOutline />
                                          </CustomAvatar>
                                          <Box
                                            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'right' }}
                                          >
                                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                              {item?.excessDays}
                                            </Typography>
                                            <Typography variant='caption'>Excess Days</Typography>
                                          </Box>
                                        </>
                                      ) : null}
                                    </Box>
                                  </Grid>
                                  <Grid item xs={12} sm={4}>
                                    <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
                                      {item.isCashable ? (
                                        <>
                                          <CustomAvatar skin='light' variant='rounded' color={'success'} sx={{ mr: 4 }}>
                                            <CurrencyUsd />
                                          </CustomAvatar>
                                          <Box
                                            sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'right' }}
                                          >
                                            <Typography variant='h6' sx={{ fontWeight: 600 }}>
                                              {item?.cashoutValue ? currencyFormat(item?.cashoutValue) : '0'}
                                            </Typography>
                                            <Typography variant='caption' sx={{ mr: 4, width: '100%' }}>
                                              Cashout Value
                                            </Typography>
                                          </Box>
                                        </>
                                      ) : null}
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
                                      maxWidth: '100% !important',
                                      width: '100%',
                                      justifyContent: 'flex-end'
                                    }}
                                  >
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                                      {item.isCashable ? (
                                        <Button
                                          variant='contained'
                                          onClick={cashoutLeaveButtonClick}
                                          disabled={!item.canCashoutLeave}
                                          sx={{ color: `rgba(${'0,0,0'}, 0.87) !important`, mt: 2, mb: 2 }}
                                        >
                                          Cashout Leave
                                        </Button>
                                      ) : (
                                        ''
                                      )}

                                      <Button
                                        component='a'
                                        variant='contained'
                                        sx={{ ml: 5, color: `rgba(${'0,0,0'}, 0.87) !important`, mt: 2, mb: 2 }}
                                        target='_blank'
                                        href={item.applyLink}
                                      >
                                        Take Leave
                                      </Button>
                                    </Box>
                                  </Grid>
                                </Grid>
                              </TableCell>
                            </TableRow>
                          )
                        })}
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
