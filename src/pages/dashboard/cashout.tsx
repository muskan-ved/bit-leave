// ** MUI Imports
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import LoadingButton from '@mui/lab/LoadingButton';

import Box, { BoxProps } from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { FormHelperText, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Eraser, Close } from 'mdi-material-ui'
import SignaturePad from 'react-signature-canvas';
import { calculateEmployeeCashout, getCashOutContract, postEmployeeCashout } from 'src/store/employee'
import { ApiResult, error } from 'src/types/error'

function Item(props: BoxProps) {
  const { sx, ...other } = props;

  return (
    <Box
    {...other}
    sx={{
      p: 1,
      m: 1,
      fontSize: '0.875rem',
      ...sx,
    }}
    />
  );
}

interface cashoutResultModel {
  success: boolean
}

const defaultCashoutApiResult: ApiResult<cashoutResultModel> = {
  data: {
    success: false
  },
  errors: null
}
interface CashOutState {
  cashoutdays: number | null,
  signature: string,
  cashoutreason: string
}

const defaultCashoutValue = {
  cashoutdays: null,
  cashoutreason: ''
}

const defaultSignatureValue = {
  signature: ''
}

const CashOutSchema = yup.object().shape({
  cashoutdays: yup.number().required().positive().integer(),
  cashoutreason: yup.string().required(),
})

const SignatureSchema = yup.object().shape({
  signature: yup.string().required()
})

const CashoutDialog = (props: any) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [calculateAmount, setcalculateAmount] = React.useState(null)
  const [cashoutApiResponse, setcashoutApiResponse] = React.useState<ApiResult<cashoutResultModel>>(defaultCashoutApiResult)
  const [employeeContract, setemployeeContract] = React.useState('')
  const [loading, setloading] = React.useState(false)
  const [leaveBalanceAfterCashout, setleaveBalanceAfterCashout]=React.useState(null)
  const [cashoutError,setcashoutError] =React.useState(false)

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch<AppDispatch>()
  const [cashout, setcashoutState] = React.useState<CashOutState>({
    cashoutdays: null,
    cashoutreason: '',
    signature: ''
  });

  const resetError = () => {
    setcashoutApiResponse({
      errors: null,
      data: null
    })
  }
  const resetCashoutDialog = () => {
    setActiveStep(0)
    setcalculateAmount(null)
    setemployeeContract('')
    setloading(false)
    resetError()
  }

  const {
    control: cashOutControl,
    handleSubmit: handleCashOutSubmit,
    watch: watchCashOutControl,
    formState: { errors: cashOutErrors }
  } = useForm({
    defaultValues: defaultCashoutValue,
    resolver: yupResolver(CashOutSchema)
  })

  const {
    control: signatureControl,
    handleSubmit: handleSignatureSubmit,
    reset: signatureReset,

    formState: { errors: signatureErrors }
  } = useForm({
    defaultValues: defaultSignatureValue,
    resolver: yupResolver(SignatureSchema)
  })
  const sigCanvas = React.useRef() as React.MutableRefObject<any>;
  const cashoutdays: number | null = watchCashOutControl('cashoutdays')

  const store = useSelector((state: RootState) => state.employee)

  const onCashOutSubmit = async (data: any) => {
    setloading(true)

    const stateData = {
      ...cashout,
      cashoutdays: data.cashoutdays,
      cashoutreason: data.cashoutreason
    }
    setcashoutState(stateData)

    const cashoutContractResponse = await dispatch(getCashOutContract(cashout))
    if (cashoutContractResponse.payload != null && cashoutContractResponse.payload.data != null && cashoutContractResponse.payload.data.contract != null) {
      setemployeeContract(cashoutContractResponse.payload.data.contract)
      setActiveStep(1);
      resetError()
      setloading(false)
    }
    else {
      const errortoDisplay: error[] = [{
        message: 'Some error occured while processing your cashout.',
        code: '',
      }];
      setloading(false)

      setcashoutApiResponse({
        errors: errortoDisplay,
        data: null
      })

    }
  }

  const onSignatureSubmit = async (data: any) => {

    const stateData = {
      ...cashout,
      signature: data.signature
    }
    setloading(true)
    const result = await dispatch(postEmployeeCashout({
      cashoutdays: stateData.cashoutdays,
      cashoutreason: stateData.cashoutreason,
      signature: stateData.signature
    }))
    //console.log(result.payload)
    if (result.payload != null && result.payload.data != null && result.payload.data?.success == true) {
      // setcalculateAmount(result.payload.data.cashoutAmount)
      setcashoutState(stateData)
      setActiveStep(2)
      resetError()
      

    }
    else {
      const errortoDisplay: error[] = [{
        message: 'Some error occured while processing your cashout.',
        code: ''
      }];
      setcashoutApiResponse({
        errors: errortoDisplay,
        data: null
      })
    }

    setloading(false)

  }
  const onClearSignature = () => {
    sigCanvas.current.clear()
    signatureReset({
      signature: ''
    })
  }

  const formatIntoPng = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL();

      return dataURL;
    }
  }
  const onError = (e: any) => console.log('errors', e);

  const onChangeCashOutDays = async (e: any) => {
    // console.log("cashAmountInDays", cashAmountInDays)
    if (e.target.value != null) {
      setloading(true)
      const result = await dispatch(calculateEmployeeCashout(e.target.value))
     // console.log(result.payload)
      if (result.payload != null ) {
      if(result.payload.data.cashoutAmount != null){
        setcalculateAmount(result.payload.data.cashoutAmount)
        setleaveBalanceAfterCashout(result.payload.data.leaveBalanceAfterCashout)
      }

      //Standardize error first

      // else if(result.payload.data.error!){

      // }
      }
      else {

        const errortoDisplay: error[] = [{
          message: 'Some error occured while processing your cashout.',
          code: ''
        }];
        setcashoutApiResponse({
          errors: errortoDisplay,
          data: null
        })
      }
      setloading(false)
    }

  }
  const handleDialogClose = (event: any, reason: string) => {
    if (reason && (reason == "backdropClick" || reason == "escapeKeyDown"))
      return;
    setActiveStep(0)
    resetCashoutDialog()
    props.handleClose()
  }

  const onClose = () => {
    setActiveStep(0)
    resetCashoutDialog()
    props.handleClose()
  }
  const errorControl = () => {
    let i = 0;
    return (

      cashoutApiResponse.errors?.map(x => {
        i++
        return <Alert key={i} variant="outlined" severity="error">{x.message}</Alert>
      })
    )
  }

  const displayContract = () => {
    return { __html: employeeContract };
  }

  const maxWidth = 'sm'
  return (
    <Dialog fullWidth={true} scroll={'paper'} fullScreen={fullScreen} maxWidth={maxWidth} open={props.open} onClose={handleDialogClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{activeStep == 0 && <>Cash Out Request</>}
        {activeStep == 1 && <>Sign your contract</>}
        {activeStep == 2 && <>Success</>}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      {activeStep == 0 &&
        <>
          <form  key='cashoutform' onSubmit={handleCashOutSubmit(onCashOutSubmit, onError)} style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>


            <DialogContent dividers={true}>
              {cashoutApiResponse.errors != null && errorControl()}

              <FormControl fullWidth>

                <Box sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                }}>
                  <Item>Days Available:</Item>
                  <Item>{store.cashoutOption != null && store.cashoutOption?.daysAvailable != null && store.cashoutOption?.daysAvailable.toFixed(2)}</Item>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'flex-start',

                }}>
                  <Item>Value (Before tax):</Item>
                  <Item> {store.cashoutOption != null && store.cashoutOption?.cashoutAmount != null && '$' + store.cashoutOption?.cashoutAmount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Item>
                </Box>

                <Controller
                  rules={{ required: true }}
                  control={cashOutControl}
                  name='cashoutdays'
                  render={({ field: { onChange } }) => (
                    <TextField id='cashoutdays' autoFocus fullWidth
                      label='Cash Out Amount (In Days)'
                      aria-describedby='cashoutdays'
                      onChange={(e) => {
                        onChange(e);
                        onChangeCashOutDays(e);
                      }}
                      error={Boolean(cashOutErrors.cashoutdays)}
                    />
                  )}
                />
                {cashOutErrors.cashoutdays && (
                  <FormHelperText id='cashoutdays' sx={{ color: 'error.main' }} >
                    Required
                  </FormHelperText>
                )}

                <Box sx={{
                  display: 'flex',
                  alignItems: 'flex-start',

                }}>
                  <Item>Cash Amount (Before tax):</Item>
                  <Item>{calculateAmount}</Item>
                </Box>
                <Box sx={{
                  display: 'flex',
                  alignItems: 'flex-start',

                }}>
                  <Item>Leave Balance After Cash Out:</Item>
                  <Item>{leaveBalanceAfterCashout}</Item>
                </Box>


                <Controller
                  rules={{ required: true }}
                  control={cashOutControl}
                  name='cashoutreason'
                  render={({ field: { onChange } }) => (

                    <TextField id='cashoutreason' autoFocus fullWidth
                      label='Cash Out Reason'
                      placeholder=''
                      aria-describedby='cashoutreason'
                      onChange={onChange}
                      multiline
                      error={Boolean(cashOutErrors.cashoutreason)}
                    />
                  )}
                />
                {cashOutErrors.cashoutreason && (
                  <FormHelperText id='cashoutreason' sx={{ color: 'error.main' }} >
                    Required
                  </FormHelperText>
                )}
              </FormControl>
            </DialogContent>
            <DialogActions disableSpacing={true} className='dialog-actions-dense'>
              {loading == false &&
                <Button  type='submit' variant="contained" style={{ marginTop: '0.75em' }}> Cash Out Leave</Button>
              }
              {loading == true &&
                <LoadingButton style={{ marginTop: '0.75em' }} loading={loading} variant="contained"  disabled>
                  Cash Out Leave
                </LoadingButton>
              }

            </DialogActions>
          </form>

        </>
      }
      {activeStep == 1 &&
        <form  key='signature-submit' onSubmit={handleSignatureSubmit(onSignatureSubmit, onError)} style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
          <DialogContent dividers={true}>
            {cashoutApiResponse.errors != null && errorControl()}

            <DialogContentText>
              In order to cashout excess leave we require as signed agreement betwen both parties
              being you and your employer.Once both parties execute the document you will recieve asigned copy.
            </DialogContentText>
            <DialogContentText>
              <div dangerouslySetInnerHTML={displayContract()} />
            </DialogContentText>

            <IconButton onClick={onClearSignature} style={{ display: 'block', position: 'relative', textAlign: 'right', left: '365px', top: '40px', 'zIndex': '100' }}>
              <Eraser></Eraser>
            </IconButton>
            <FormControl>

              <Controller
                name="signature"
                control={signatureControl}
                render={({ field }) => (
                  <>

                    <SignaturePad
                      ref={sigCanvas}
                      onEnd={() => field.onChange(formatIntoPng())}
                      penColor="black"
                      canvasProps={{
                        width: 400,
                        height: 80,
                        style: { border: "1px solid black" },
                      }}
                    />
                  </>
                )}
              />
              {signatureErrors.signature && (
                <FormHelperText sx={{ color: 'error.main' }} >
                  Signature is required
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            {loading == false &&
              <Button style={{ marginTop: '0.75em' }} type='submit' variant="contained">Sign Contract</Button>
            }
            {loading == true &&
              <LoadingButton style={{ marginTop: '0.75em' }} loading={loading} variant="contained" disabled>
                Sign Contract
              </LoadingButton>
            }
          </DialogActions>
        </form>
      }
      {activeStep == 2 &&
        <> <DialogContent dividers={true}>

          <DialogContentText>
            Thank you for using bit.leave!
          </DialogContentText>
          <DialogContentText>
            You will recieve a notification once your leave cash out has been approved.
            You will be able to view this contract in your 'My contracts & History' section.
          </DialogContentText>
        </DialogContent>
        </>
      }
    </Dialog>
  )

}


export default CashoutDialog
