import {
  Button,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
  TextField,
  Grid,
  Card,
  CardActions,
  CircularProgress,
  Avatar,
  ButtonProps
} from '@mui/material'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { AppDispatch } from 'src/store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { loadOrganisation, payrollDisconnect } from 'src/store/organisation';
import { payrollType } from 'src/types/organisation';
import LoadingButton from '@mui/lab/LoadingButton';
import styled from '@emotion/styled';

// style button

const ButtonXero = styled(Button)<ButtonProps>(({ theme }:any) => ({
  background: theme.palette.grey[200] ,
  color:'#0a77c1',
  
}))

const Payroll = () => {

  const [payrollData, setPayrollData] = useState<payrollType | any>([]);
  const dispatch = useDispatch<AppDispatch>()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false)

  const fetchOrganisationData = async () => {
    setIsLoading(true)
    const orgData = await dispatch(loadOrganisation())
    if (orgData.payload != null) {

      setPayrollData(orgData?.payload?.data[0]?.organisationspayrolls)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchOrganisationData()
  },[])

  const handleDelete = async () => {
    setDeleteLoading(true)
    const payrollDis = await dispatch(payrollDisconnect())
    if(payrollDis.payload != null) {
    setDeleteLoading(false)
    }
    setDeleteLoading(false)
    
  }

  if (isLoading && !payrollData) return <CircularProgress color='success' />

  return (
    <Card>
      <CardHeader title='Payroll Details' subheader={<Divider></Divider>} />
      <CardContent >
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              type='string'
              label='Payroll Name'
              name='Payroll Name'
              defaultValue={'XERO'}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                )
              }}
              disabled
            />
          </Grid>
        <Grid item xs={12}>
            <TextField
              fullWidth
              type='string'
              label='Tenant Name'
              name='Tenant Name'
              value={payrollData[0]?.tenantName}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                )
              }}
              disabled
            />
          </Grid>
        <Grid item xs={12}>
            <TextField
              fullWidth
              type='string'
              label='Tenant Id'
              name='Tenant Id'
              value={payrollData[0]?.payrollTenantId}
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <PersonOutlineOutlinedIcon />
                  </InputAdornment>
                )
              }}
              disabled
            />
          </Grid>
        </Grid>
        
      </CardContent>
      <CardActions>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <ButtonXero variant='contained' disabled >
            <Avatar src='/images/cards/xero_icon.png' sx={{mr:5}}/> Connect to Xero
            </ButtonXero>
            {!deleteLoading ?<ButtonXero variant='contained' onClick={handleDelete} sx={{ml:6}}>
            <Avatar src='/images/cards/xero_icon.png' sx={{mr:5 }}/> Disconnect from Xero
            </ButtonXero>
           : 
           <LoadingButton loading={deleteLoading} variant='contained' sx={{ml:6}} disabled>
                <Avatar src='/images/cards/xero_icon.png' sx={{mr:5}}/>  Disconnect from Xero
            </LoadingButton>}
          </Grid>

        </Grid>
      </CardActions>
    </Card>
  )
}

export default Payroll
