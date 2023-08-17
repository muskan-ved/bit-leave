// ** MUI Imports
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material'
import { Eraser, Close } from 'mdi-material-ui'
import SignaturePad from 'react-signature-canvas'
import { calculateEmployeeCashout, getCashOutContract, postEmployeeCashout } from 'src/store/employee'
import { ApiResult, error } from 'src/types/error'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { useRouter } from 'next/router'
import { styled } from '@mui/material/styles'
import Grid, { GridProps } from '@mui/material/Grid'
import * as gtag from '../../lib/gtag'

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
  cashoutdays: number | null
  signature: string
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
  cashoutreason: yup.string().required()
})

const SignatureSchema = yup.object().shape({
  signature: yup.string().required()
})

const CashoutDialog = (props: any) => {
  const [activeStep, setActiveStep] = React.useState(0)
  const [calculateAmount, setcalculateAmount] = React.useState(null)
  const [cashoutApiResponse, setcashoutApiResponse] =
    React.useState<ApiResult<cashoutResultModel>>(defaultCashoutApiResult)
  const [employeeContract, setemployeeContract] = React.useState('')
  const [loading, setloading] = React.useState(false)
  const [leaveBalanceAfterCashout, setleaveBalanceAfterCashout] = React.useState(null)
  const [toggleValue, setToggleValue] = React.useState(false)
  const [calculateData, setCalculateData] = React.useState<any>('')
  const [errMessage, setErrorMessage] = React.useState<any>('')

  const theme = useTheme()
  const router = useRouter()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const dispatch = useDispatch<AppDispatch>()
  const [cashout, setcashoutState] = React.useState<CashOutState>({
    cashoutdays: null,
    cashoutreason: '',
    signature: ''
  })

  const resetError = () => {
    setcashoutApiResponse({
      errors: null,
      data: null
    })
  }
  const resetCashoutDialog = () => {
    setActiveStep(0)
    setcalculateAmount(null)
    setleaveBalanceAfterCashout(null)
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
  const sigCanvas = React.useRef() as React.MutableRefObject<any>
  const store = useSelector((state: RootState) => state.employee)
  const filterLeavesData: any = store.pages.filter((p: any) => p.category === 'MyLeaves')
  const getCashoutOptions = filterLeavesData && filterLeavesData[0]?.data.filter((p: any) => p.name === 'Annual Leave')

  const onCashOutSubmit = async (data: any) => {
    setloading(true)

    const stateData = {
      ...cashout,
      cashoutdays: data.cashoutdays,
      cashoutreason: data.cashoutreason
    }
    setcashoutState(stateData)
    gtag.event({
      action: 'cash_out_leave',
      category: 'dashboard',
      label: 'cash_out_leave',
      value: 'modal'
    })

    const cashoutContractResponse = await dispatch(getCashOutContract(stateData))
    if (cashoutContractResponse.payload !== null) {
      setemployeeContract(cashoutContractResponse.payload)
      setActiveStep(1)
      resetError()
      setloading(false)
      setToggleValue(false)
    } else {
      const errortoDisplay: error[] = [
        {
          message: 'Some error occured while processing your cashout.',
          code: ''
        }
      ]
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
    gtag.event({
      action: 'sign_contract',
      category: 'dashboard',
      label: 'sign_contract',
      value: 'modal'
    })
    const result = await dispatch(postEmployeeCashout(stateData))
    if (result.payload) {
      setcashoutState(result.payload)
      setActiveStep(2)
      resetError()
    } else {
      const errortoDisplay: error[] = [
        {
          message: 'Some error occured while processing your cashout.',
          code: ''
        }
      ]
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
    gtag.event({
      action: 'signature_clear',
      category: 'dashboard',
      label: 'signature_clear',
      value: 'modal'
    })
  }

  const formatIntoPng = () => {
    if (sigCanvas.current) {
      const dataURL = sigCanvas.current.toDataURL()
      return dataURL
    }
  }

  const onError = (e: any) => {
    return ''
  }
  const onChangeCashOutDays = async (e: any) => {
    setcalculateAmount(null);
      const daysAvalble =
      getCashoutOptions.length > 0 &&
      getCashoutOptions[0]?.cashoutOptions != null &&
      getCashoutOptions[0]?.cashoutOptions?.daysAvailable != null &&
      getCashoutOptions[0]?.cashoutOptions?.daysAvailable

    if (e.target.value > daysAvalble) {
      setErrorMessage('Requested cashout days are greater than days available')
    } else if (e.target.value === '') {
      setErrorMessage('Days should not be empty')
    } else {
      setErrorMessage('')
    }

    if (e.target.value !== '') {
      setloading(true)
      setToggleValue(true)

      setTimeout(async() => {
      const result = await dispatch(calculateEmployeeCashout(parseInt(e.target.value)))
      if (result.payload != null) {
        if (result.payload.cashoutAmount != null) {
          setCalculateData(result.payload)
            setcalculateAmount(result.payload.cashoutAmount);
            setleaveBalanceAfterCashout(result.payload.leaveBalanceAfterCashout)
          } else if (result?.payload?.response?.data?.errors?.[0]?.message) {
            setcalculateAmount(null)
          }
        } else {
          const errortoDisplay: error[] = [
          {
            message: 'Some error occured while processing your cashout.',
            code: ''
          }
        ]
        setcashoutApiResponse({
          errors: errortoDisplay,
          data: null
        })
      }
    },3000)
      setloading(false)
    }
  }
  const handleDialogClose = (event: any, reason: string) => {
    if (reason && (reason == 'backdropClick' || reason == 'escapeKeyDown')) return
    setActiveStep(0)
    resetCashoutDialog()
    props.handleClose()
  }

  const onClose = () => {
    setActiveStep(0)
    resetCashoutDialog()
    setErrorMessage('')
    router.push('/dashboard/leaves/')
    props.handleClose()
  }
  gtag.event({
    action: 'close_and_refresh_dashboard',
    category: 'dashboard',
    label: 'close_and_refresh_dashboard',
    value: 'moddal'
  })
  const errorControl = () => {
    let i = 0
    return cashoutApiResponse.errors?.map(x => {
      i++
      return (
        <Alert key={i} variant='outlined' severity='error' sx={{ marginBottom: '20px' }}>
          {x.message}
        </Alert>
      )
    })
  }

  const displayContract = () => {
    return { __html: employeeContract }
  }

  const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center'
    }
  }))

  const Img = styled('img')(({ theme }) => ({
    height: '200px',
    width: '200px',
    [theme.breakpoints.down('sm')]: {
      width: 250,
      position: 'static'
    }
  }))

  const maxWidth = 'sm'

  const tooltipLink =
    'https://www.ato.gov.au/rates/schedule-5---tax-table-for-back-payments,-commissions,-bonuses-and-similar-payments/#iiAdditionalpaymentsappliedoverthewholef'

  return (
    <>
      <Dialog
        fullWidth={true}
        scroll={'paper'}
        fullScreen={fullScreen}
        maxWidth={maxWidth}
        open={props.open}
        onClose={handleDialogClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>
          {activeStep == 0 && <>Cash Out Request</>}
          {activeStep == 1 && <>Sign your contract</>}
          {activeStep == 2 && <>Success</>}
          <IconButton
            aria-label='close'
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: theme => theme.palette.grey[500]
            }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        {activeStep == 0 && (
          <>
            <form
              key='cashoutform'
              onSubmit={handleCashOutSubmit(onCashOutSubmit, onError)}
              style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
            >
              <DialogContent dividers={true}>
                {cashoutApiResponse.errors != null && errorControl()}
                <FormControl fullWidth>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      pb: '1.25rem'
                    }}
                  >
                    <TextField
                      fullWidth
                      type='string'
                      label='Days Available'
                      name='Days Available'
                      value={
                        getCashoutOptions &&
                        getCashoutOptions.length > 0 &&
                        getCashoutOptions[0]?.cashoutOptions != null &&
                        getCashoutOptions[0]?.cashoutOptions?.daysAvailable != null &&
                        getCashoutOptions[0]?.cashoutOptions?.daysAvailable.toFixed(0)
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <CalendarMonthIcon />
                          </InputAdornment>
                        )
                      }}
                      disabled
                      sx={{ background: '#91919121' }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      pb: '1.25rem'
                    }}
                  >
                    <TextField
                      fullWidth
                      type='string'
                      label='Value (Before tax)'
                      name='Value (Before tax)'
                      value={
                        getCashoutOptions &&
                        getCashoutOptions.length > 0 &&
                        getCashoutOptions[0]?.cashoutOptions != null &&
                        getCashoutOptions[0]?.cashoutOptions?.cashoutAmount != null &&
                        getCashoutOptions[0]?.cashoutOptions?.cashoutAmount
                          .toFixed(2)
                          .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                      }
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <AttachMoneyIcon />
                          </InputAdornment>
                        )
                      }}
                      disabled
                      sx={{ background: '#91919121' }}
                    />
                  </Box>

                  <Controller
                    rules={{ required: true }}
                    control={cashOutControl}
                    name='cashoutdays'
                    render={({ field: { onChange } }) => (
                      <TextField
                        id='cashoutdays'
                        autoFocus
                        fullWidth
                        label='Cash Out Amount (In Days)'
                        aria-describedby='cashoutdays'
                        onChange={e => {
                          onChange(e)
                          onChangeCashOutDays(e)
                        }}
                        error={Boolean(cashOutErrors.cashoutdays)}
                      />
                    )}
                  />

                  {errMessage && (
                    <FormHelperText id='cashoutdays' sx={{ color: 'error.main' }}>
                      {errMessage}
                    </FormHelperText>
                  )}
                  {toggleValue && calculateAmount && errMessage === '' ? (
                    <Controller
                      rules={{ required: true }}
                      control={cashOutControl}
                      name='cashoutreason'
                      render={({ field: { onChange } }) => (
                        <TextField
                          id='cashoutreason'
                          autoFocus
                          fullWidth
                          label='Cash Out Reason'
                          placeholder=''
                          aria-describedby='cashoutreason'
                          onChange={onChange}
                          multiline
                          error={Boolean(cashOutErrors.cashoutreason)}
                          sx={{ mt: '1.25rem' }}
                        />
                      )}
                    />
                  ) : (
                    toggleValue && calculateAmount === null && errMessage === ''? <Box sx={{textAlign: 'center',marginTop: '30px'}}><CircularProgress color='success' /></Box> :''
                  )}
                  {toggleValue && calculateAmount && errMessage === ''
                    ? cashOutErrors.cashoutreason && (
                        <FormHelperText id='cashoutreason' sx={{ color: 'error.main' }}>
                          Required
                        </FormHelperText>
                      )
                    : ''}

                  {toggleValue && calculateAmount && errMessage === '' ? (
                    <Card sx={{ marginTop: '1.50rem' }}>
                      <CardContent>
                        <Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon sx={{ color: 'primary.main', mr: 2.5, fontSize: 'medium' }} />
                          <Typography variant='body2'>Cashout Amount</Typography>{' '}
                          <Typography variant='body2' marginLeft={'43px'}>
                            {calculateData?.cashoutAmount?.toFixed(2)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon sx={{ color: 'primary.main', mr: 2.5, fontSize: 'medium' }} />
                          <Typography variant='body2'>Tax </Typography>
                          <Typography variant='body2' marginLeft={'138px'}>
                            {calculateData?.taxAmount?.toFixed(2)}{' '}
                          </Typography>
                        </Box>
                        <Divider></Divider>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <AttachMoneyIcon sx={{ color: 'primary.main', mr: 2.5, fontSize: 'medium' }} />
                          <Typography variant='body2'>Estimated Post Tax Amount </Typography>
                          <Typography variant='body2' marginLeft={'73px'}>
                            {calculateData?.totalAmount?.toFixed(2)}{' '}
                          </Typography>
                          <Tooltip
                            title={
                              <Typography variant='caption' sx={{ color: 'white', textAlign: 'justify' }}>
                                This is an indicative amount as payroll uses the{' '}
                                <a href={tooltipLink} style={{ textDecoration: 'none', color: 'blue' }}>
                                  Method B (ii) calculation
                                </a>{' '}
                                to calculate the correct post-tax amount
                              </Typography>
                            }
                            arrow
                            sx={{ marginLeft: 'auto' }}
                          >
                            <HelpOutlineIcon />
                          </Tooltip>
                        </Box>
                      </CardContent>
                    </Card>
                  ) : (
                    ''
                  )}
                </FormControl>
              </DialogContent>
              <DialogActions disableSpacing={true} className='dialog-actions-dense'>
                {loading == false && (
                  <Button
                    type='submit'
                    variant='contained'
                    style={{ marginTop: '0.75em' }}
                    disabled={calculateAmount === 0 || calculateAmount === null || errMessage !== ''}
                  >
                    {' '}
                    Cash Out Leave
                  </Button>
                )}
                {loading == true && (
                  <LoadingButton style={{ marginTop: '0.75em' }} loading={loading} variant='contained' disabled>
                    CashOutLeave
                  </LoadingButton>
                )}
              </DialogActions>
            </form>
          </>
        )}
        {activeStep == 1 && (
          <form
            key='signature-submit'
            onSubmit={handleSignatureSubmit(onSignatureSubmit, onError)}
            style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <DialogContent dividers={true}>
              {cashoutApiResponse.errors != null && errorControl()}

              <DialogContentText>
                In order to cashout excess leave we require as signed agreement betwen both parties being you and your
                employer.Once both parties execute the document you will recieve asigned copy.
              </DialogContentText>
              <DialogContentText>
                <span dangerouslySetInnerHTML={displayContract()} />
              </DialogContentText>

              <IconButton
                onClick={onClearSignature}
                style={{
                  display: 'block',
                  position: 'relative',
                  textAlign: 'right',
                  left: '365px',
                  top: '40px',
                  zIndex: '100'
                }}
              >
                <Eraser></Eraser>
              </IconButton>
              <FormControl>
                <Controller
                  name='signature'
                  control={signatureControl}
                  render={({ field }) => (
                    <>
                      <SignaturePad
                        ref={sigCanvas}
                        onEnd={() => field.onChange(formatIntoPng())}
                        penColor='black'
                        canvasProps={{
                          width: 400,
                          height: 80,
                          style: { border: '1px solid black' }
                        }}
                      />
                    </>
                  )}
                />
                {signatureErrors.signature && (
                  <FormHelperText sx={{ color: 'error.main' }}>Signature is required</FormHelperText>
                )}
              </FormControl>
            </DialogContent>
            <DialogActions className='dialog-actions-dense'>
              {!loading ? (
                <Button type='submit' variant='contained' style={{ marginTop: '0.75em' }}>
                  Sign Contract
                </Button>
              ) : (
                <LoadingButton style={{ marginTop: '0.75em' }} loading={loading} variant='contained' disabled>
                  Sign Contract
                </LoadingButton>
              )}
            </DialogActions>
          </form>
        )}
        {activeStep == 2 && (
          <>
            <DialogContent dividers={true}>
              <Grid container spacing={6}>
                <StyledGrid item xs={12} sm={5}>
                  <Img alt='Congratulations Daisy' src={`/images/cards/success.jpg`} />
                </StyledGrid>
                <Grid item xs={12} sm={7}>
                  <DialogContentText marginBottom={'20px'} fontWeight={'bold'}>
                    Thank you for using bit.leave! 🎉
                  </DialogContentText>
                  <DialogContentText marginBottom={'20px'}>
                    You will recieve a notification once your leave cash out has been approved, based on your
                    organisation's policy.
                  </DialogContentText>
                  <DialogActions className='dialog-actions-dense' sx={{ justifyContent: 'center' }}>
                    <Button type='submit' onClick={onClose} variant='contained' style={{ marginTop: '0.75em' }}>
                      Close and Refresh Dashboard
                    </Button>
                  </DialogActions>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>
    </>
  )
}

export default CashoutDialog
