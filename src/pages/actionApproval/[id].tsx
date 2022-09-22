// ** React Imports
import {  useEffect, useState } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'

// ** Next Imports
import {useRouter} from 'next/router'

// ** Icons Imports
import Divider from '@mui/material/Divider'

// ** Types Import
import {actionApproval} from 'src/types/actionApproval'

// ** MUI Import
import { Grid, InputAdornment, TextField } from '@mui/material'

// ** MUI Icon Import
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { cashoutActionApproval } from 'src/store/actionapproval'

const ActionApproval = () =>{
  
  const [data, setData] = useState<actionApproval | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)
	const dispatch = useDispatch<AppDispatch>()
  
  // demo data 
  const dataa = {
    submitApproval: "Kushal vaghani",
    signatureOfEmployee: "data:image/png;base64,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"
  }

  const router = useRouter();
  const {id} = router.query;
  
  useEffect(() => {
    if (!id) {
    }else{
        setIsLoading(true);
        fetchData();
      }
    }, [id]);
    
    const fetchData = async () => {
      setIsLoading(true);
         await dispatch(cashoutActionApproval(id))
          .then(res => {
            setData(res.payload.data.action)
            setIsLoading(false);
          })
      };

    if (isLoading)
    return (<CircularProgress color="success" />)

    if (!isLoading && data) { 

    return (
        <Card>
              <CardHeader title='Cashout Approval Details' subheader={<Divider></Divider>} />
              <CardContent>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                    <TextField
                    fullWidth
                    type='number'
                    label='Applied Hours'
                    name='Applied Hours'
                    defaultValue={data?.cashoutdays} 
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position='start'>
                        <QueryBuilderIcon/>
                      </InputAdornment>
                      )
                    }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                    fullWidth
                    type='number'
                    label='Cashout Value'
                    name='Cashout Value'
                    defaultValue={data?.cashoutamt} 
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position='start'>
                        <AttachMoneyIcon/>
                      </InputAdornment>
                      )
                    }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                    fullWidth
                    type='string'
                    label='Date of Signed'
                    name='Date of Signed'
                    defaultValue={data?.actiondate} 
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position='start'>
                        <CalendarMonthIcon/>
                      </InputAdornment>
                      )
                    }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                    fullWidth
                    type='string'
                    label={data.approvalreason ? 'Approval Reason' : 'Rejected Reason' }
                    name={data.approvalreason ? 'Approval Reason' : 'Rejected Reason' }
                    defaultValue={data.approvalreason ? data.approvalreason : data.rejectreason } 
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position='start'>
                        {data.approvalreason ? <CheckCircleOutlineIcon/> : <HighlightOffIcon/>}
                      </InputAdornment>
                      )
                    }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                    fullWidth
                    type='string'
                    label="Approval By"
                    name="Approval By"
                    defaultValue={data?.submitApproval} 
                    InputProps={{
                      readOnly: true,
                      startAdornment: (
                      <InputAdornment position='start'>
                        <PersonOutlineIcon/>
                      </InputAdornment>
                      )
                    }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                    fullWidth
                    label="Signature of Employee"
                    name="Signature of Employee"
                    sx={{
                      img: {
                        marginTop:'1rem',
                      }
                    }}
                    InputProps={{
                      readOnly: true,
                      startAdornment: (

                      <img src={dataa?.signatureOfEmployee} alt='signature of employee' width='200px' />
                      )
                    }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
      )
}
}

ActionApproval.acl = {
  action: 'read',
  subject: 'actionApproval'
}

export default ActionApproval