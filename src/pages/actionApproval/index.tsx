// ** React Imports
import {  useEffect, useState, useRef } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// ** Next Imports
import {useRouter} from 'next/router'

// ** Icons Imports
import Divider from '@mui/material/Divider'

// ** Types Import
import {actionApproval} from 'src/types/actionApproval'

// ** MUI Import
import { Button, Grid, IconButton, InputAdornment,FormControl, FormControlLabel,FormHelperText, TextField, FormLabel } from '@mui/material'
import SignaturePad from 'react-signature-canvas';


// ** MUI Icon Import
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import TodayOutlinedIcon from '@mui/icons-material/TodayOutlined';

// ** Redux Import
import { useDispatch } from 'react-redux'
import { AppDispatch } from 'src/store'
import { cashoutActionApproval, cashoutUploadActionApproval } from 'src/store/actionapproval'

// ** Hooks Imports
import { Eraser } from 'mdi-material-ui'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import LoadingButton from '@mui/lab/LoadingButton'
import { employeeType } from 'src/types/dashboard'
import { loadEmployee } from 'src/store/employee'


const defaultApprovalValue = {
	signature: ''
}

const approvalSchema = yup.object().shape({
	signature: yup.string().required()
})

const ActionApproval = () =>{
  
  const [data, setData] = useState<actionApproval | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loading1, setLoading1] = useState<boolean>(false);
  const [empSignature, setEmpSignature] = useState<string | null>('');
  const [reason, setReason] = useState<string | null>('');
  const [approvalErrors,setApprovalErrors] = useState<boolean>(false);
  const [empData, setEmpData] = useState<employeeType | null>(null)

	const dispatch = useDispatch<AppDispatch>()

  const theme = useTheme()
  const router = useRouter();
  const {id} = router.query;
	const sigCanvas = useRef() as React.MutableRefObject<any>;

  const {
    control: approvalControl,
		watch: watchApproval,
		reset: approvalReset,
	} = useForm({
    defaultValues: defaultApprovalValue,
		resolver: yupResolver(approvalSchema)
	})
  
  const approvalSelected = watchApproval()

  const formatIntoPng = () => {
		if (sigCanvas.current) {
			const dataURL = sigCanvas.current.toDataURL();
      setEmpSignature(dataURL)
			return dataURL;
		}
	}

  const fetchEmpData = async () => {
    setIsLoading(true);
    const empData = await dispatch(loadEmployee())
    if (empData.payload != null) {
      setEmpData(empData.payload.data)
      setIsLoading(false)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!id) {
    }else{
      setIsLoading(true);
        fetchData();
        fetchEmpData();
      }
    }, [id]);
    
    const fetchData = async () => {
      setIsLoading(true);
         await dispatch(cashoutActionApproval(id))
          .then(res => {
            setData(res.payload)
            setIsLoading(false);
          }).catch(err => {
            setIsLoading(false);
          })
      };

    const handleApproveRejected = async (val:boolean) =>{
      const params = {
        actionId : id,
        reason : reason,
        signature : empSignature,
        approved : val,
      }

      if(!empSignature){
        setApprovalErrors(true)
      }else{
        if(val){
          setLoading(true);
        }else{
          setLoading1(true);      
        }
          await dispatch(cashoutUploadActionApproval(params))
          .then((res) => {
            setLoading(false);
            setLoading1(false);
            if(!res.payload.response && val === true){
              toast.success('Cashout Request Approved')
              router.replace('/dashboard')
            }
            else if(!res.payload.response && val === false){
              toast.success('Cashout Request Rejected')
              router.replace('/dashboard')
            }
            else if(res.payload.response.data.errors[0].message){
              toast.error(res.payload.response.data.errors[0].message)
            }
            setReason('');
            onClearSignature()
            setApprovalErrors(false);
         
            
          }).catch(err => {
            setLoading(false);
            setLoading1(false)
            toast.error('Unfortunately, there was an issue, please try again')
          })
        }
    }

    const onClearSignature = () => {
      sigCanvas.current.clear()
      approvalReset({
        ...approvalSelected,
        signature: ''
      })
    }

    if (isLoading)
    return (<CircularProgress color="success" />)

    if (!isLoading && data) { 

    return (
      <>
            <Card>
            <ToastContainer/>
            <CardHeader title='Cashout Approval Details' subheader={<Divider></Divider>} />
            <CardContent>
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <TextField
                fullWidth
                type='string'
                label="Employee Name"
                name="Employee Name"
                defaultValue={data?.EmployeeName} 
                InputProps={{
                  startAdornment: (
                  <InputAdornment position='start'>
                    <PersonOutlineIcon/>
                  </InputAdornment>
                  )
                }}
                disabled
                />
              </Grid> 
              <Grid item xs={12}>
                  <TextField
                  fullWidth
                  type='number'
                  label='Cashout Days'
                  name='Cashout Days'
                  defaultValue={data?.CashoutDays} 
                  InputProps={{
                     startAdornment: (
                    <InputAdornment position='start'>
                      <TodayOutlinedIcon/>
                    </InputAdornment>
                    )
                  }}
                  disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                  fullWidth
                  type='number'
                  label='Cashout Amount'
                  name='Cashout Amount'
                  defaultValue={data?.CashoutAmount} 
                  InputProps={{
                     startAdornment: (
                    <InputAdornment position='start'>
                      <AttachMoneyIcon/>
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
                    label={'Cashout Reason' }
                    name={'Cashout Reason' }
                    defaultValue={data?.CashoutReason } 
                    InputProps={{
                         startAdornment: (
                      <InputAdornment position='start'>
                      <LiveHelpOutlinedIcon/>
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
                  label='Cashout Request Date'
                  name='Action Date'
                  defaultValue={data?.RequestDate} 
                  InputProps={{
                     startAdornment: (
                    <InputAdornment position='start'>
                      <CalendarMonthIcon/>
                    </InputAdornment>
                    )
                  }}
                  disabled
                  />
                </Grid>
               <Divider></Divider>
                <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="outlined-multiline-static"
                  label="Approve / Reject Reason"
                  multiline
                  rows={4}
                  defaultValue="Default Value"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                </Grid>
                <Grid item xs={12}>
                <FormLabel id="demo-radio-buttons-group-label" sx={{fontSize:'13px'}}>Signature:</FormLabel>
                </Grid>
                <Grid item xs={12}>
								<FormControl>
                  <IconButton onClick={onClearSignature} style={{ display: 'block', position: 'absolute', textAlign: 'right', left: '278px', 'zIndex': '100' }}>
									  <Eraser></Eraser>
								  </IconButton>
									<Controller
										name="signature"
										control={approvalControl}
										render={({ field }) => (
											<>

												<SignaturePad
													ref={sigCanvas}
													onEnd={() => field.onChange(formatIntoPng())}
													penColor="black"
													canvasProps={{
													height:150,
                          width:320,
														style: { border: `1px solid ${theme.palette.grey[500]}`,borderRadius:'5px' },
                            
													}}
												/>
											</>
										)}
									/>
									{approvalErrors && (
										<FormHelperText sx={{ color: 'error.main' }} >
											Signature is required
										</FormHelperText>
									)}
								</FormControl>
                </Grid>          
                <Grid item xs={12}>
                  {!loading ?
                  <Button variant='contained' onClick={() => handleApproveRejected(true)} disabled={empData?.role === 3}>Approved</Button>: 
                   <LoadingButton loading={loading} size='large' type='submit' variant='contained' disabled>
                  Approved
                  </LoadingButton>}
                  {!loading1 ?
                  <Button variant='contained' onClick={() => handleApproveRejected(false)} disabled={empData?.role === 3} sx={{marginLeft:'10px'}}>Rejected</Button>:
                  <LoadingButton loading={loading1} size='large' type='submit' variant='contained' sx={{marginLeft:'10px'}} disabled>
                  Rejected
                  </LoadingButton>}
                </Grid>
              </Grid>
            </CardContent>
            </Card>
        </>
      )
    }else if(!data){
      return(
      <Card>
      <CardHeader title='Cashout Approval Details' subheader={<Divider></Divider>} />
      <CardContent>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          Data not appear
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