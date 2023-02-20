// ** React Imports
import {  useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icons Imports
import Divider from '@mui/material/Divider'
import { OfficeBuildingOutline } from 'mdi-material-ui'
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';

//  ** Types Imports
import { setup } from 'src/types/setup'
import { Checkbox, CircularProgress, FormControlLabel } from '@mui/material'
import { setUPPost } from 'src/store/setup'
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoadingButton from '@mui/lab/LoadingButton'
import * as gtag from '../../lib/gtag'
import { employeeType } from 'src/types/dashboard'
import { loadEmployee } from 'src/store/employee'

const Setup = () => {

  const [normalEntitlement, setNormalEntitlement] = useState<setup | number>(38);
  const [leaveName, setLeaveName] = useState<setup | string>('bit.leave');
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [empData, setEmpData] = useState<employeeType | null>(null)
	const dispatch = useDispatch<AppDispatch>()

  const fetchDataFromRedux = async () => {
    setIsLoading(true);
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setEmpData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
      setIsLoading(true)
      fetchDataFromRedux();
  }, [])

  const handleOnChange = (element:any) =>{
    if(element.target.name === "NormalEntitlement"){
      setNormalEntitlement(element.target.value)
    }
    if(element.target.name === "Name"){
      setLeaveName(element.target.value)
    }
  }

  const handleSubmit = async(e:any) =>{
    e.preventDefault();

    const request = {
      name:leaveName,
      normalEntitlement:(normalEntitlement && typeof(normalEntitlement) === "string"?parseInt(normalEntitlement): normalEntitlement),
      typeOfUnits:'hours',
      isPaidLeave:true,
      showOnPayslip:true,
    }
    gtag.event({
			action: 'create_bit.leave',
			category: 'bitleave_setup',
			label: "create_bit.leave",
			value:'create_bit.leave'
		  })
    setIsLoading(true)
     await dispatch(setUPPost(request)).then((res)=>{
      if(res.payload !== undefined){
        setIsLoading(false);
        toast.success("Successfully uploaded ")}
      else{
        setIsLoading(false);
        toast.error("Failed to upload the data")
      }
    })
  }

    return (
      <Card>
         <ToastContainer/>
        <CardHeader title='Setup - Add bit.leave to XERO' subheader={<Divider></Divider>} />
        <CardContent>
          <Typography sx={{ mb: 4.5 }}>
          Filling out below, adds a new leave type if you have allowed connection to Xero
          </Typography>
          <form onSubmit={handleSubmit} >
            <Grid container spacing={5}>
              <Grid item xs={12}>
              <FormControlLabel disabled control={<Checkbox />} label="IsPaidLeave" checked/>
              <FormControlLabel disabled control={<Checkbox />} label="ShowOnPayslip" checked />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='string'
                  label='Name'
                  name='Name'
                  defaultValue={
                    "bit.leave"
                  }
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <OfficeBuildingOutline />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                  
                  // disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='string'
                  label='TypeOfUnits'
                  name='TypeOfUnits'
                  defaultValue={"hours"}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccessTimeOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type='number'
                  label='NormalEntitlement'
                  name='NormalEntitlement'
                  defaultValue={normalEntitlement}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <AccessTimeOutlinedIcon />
                      </InputAdornment>
                    )
                  }}
                  onChange={(ele) => handleOnChange(ele)}
                />
              </Grid>
              <Grid item xs={12}>
                {!isLoading ?
                <Button type='submit' variant='contained' size='large' disabled={empData?.role === 3}>
                Create bit.leave
                </Button>:
                <LoadingButton loading={isLoading} type='submit' variant='contained' size='large' disabled>
                      Create bit.leave
                </LoadingButton>
                }
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    )
  }

Setup.acl = {
  action: 'manage',
  subject: 'Setup'
}

export default Setup


