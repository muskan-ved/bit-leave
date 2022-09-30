// ** React Imports
import {  useState } from 'react'

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
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Setup = () => {

  const [name, setName] = useState<setup | string>();
  const [typeOfUnits, setTypeOfUnits] = useState<setup | string>();
  const [normalEntitlement, setNormalEntitlement] = useState<setup | number>();
  const [isPaidLeave, setIsPaidLeave] = useState<setup | boolean>();
  const [showOnPayslip, setShowOnPayslip] = useState<setup | boolean>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
	const dispatch = useDispatch<AppDispatch>()


  const handleOnChange = (element:any) =>{

    if(element.target.name === "NormalEntitlement"){
      setNormalEntitlement(element.target.value)
    }
  }

  const handleSubmit = async(e:any) =>{
    e.preventDefault();

    const request = {
      normalEntitlement:normalEntitlement,
    }

    const setupResponse = await dispatch(setUPPost(request)).then((res)=>{
      setIsLoading(false);
      toast.success("Successfully uploaded ")
    }).catch((err)=>{
      setIsLoading(false);
        toast.error("Failed to upload the data")
      })
  }

  if (isLoading)
    return (<CircularProgress color="success" />)

    return (
      <Card>
         <ToastContainer/>
        <CardHeader title='Setup - Add bit.leave to XERO' subheader={<Divider></Divider>} />
        <CardContent>
          <Typography sx={{ mb: 4.5 }}>
          Filling out below, adds a new leave type if you have allowed connection to xero
          </Typography>
          <form onSubmit={handleSubmit} >
            <Grid container spacing={5}>
              <Grid item xs={12}>
              <FormControlLabel disabled control={<Checkbox />} label="IsPaidLeave" checked />
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
                  disabled
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
                  defaultValue={38}
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
                <Button type='submit' variant='contained' size='large'>
                Create bit.leave
                </Button>
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


