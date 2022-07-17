// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Box, { BoxProps } from '@mui/material/Box'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { Container, FormHelperText, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Eraser } from 'mdi-material-ui'
import SignaturePad from 'react-signature-canvas';




function Item(props: BoxProps) {
  const { sx, ...other } = props;

  return (
    <Box
      sx={{
        p: 1,
        m: 1,
        fontSize: '0.875rem',
        ...sx,
      }}
      {...other}
    />
  );
}

interface CashOutState {
  cashAmountInDays: number | null,
  signature: string,
  cashOutReason: string
}

const defaultCashoutValue = {
  cashAmountInDays: null,
  cashOutReason: ''
}

const defaultSignatureValue = {
  signature: ''
}


const CashOutSchema = yup.object().shape({
  cashAmountInDays: yup.number().required().positive().integer(),
  cashOutReason: yup.string().required(),
})

const SignatureSchema = yup.object().shape({
  signature: yup.string().required()
})

const CashoutDialog = (props: any) => {
  const [activeStep, setActiveStep] = React.useState(0);

  //const dispatch = useDispatch<AppDispatch>()
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [cashout, setcashoutState] = React.useState<CashOutState>({
    cashAmountInDays: null,
    cashOutReason: '',
    signature: ''
  });

  const {
    control: cashOutControl,
    handleSubmit: handleCashOutSubmit,
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


  const store = useSelector((state: RootState) => state.employee)
  console.log('cashout', store);
  const onCashOutSubmit = async (data: any) => {

    const stateData = {
      ...cashout,
      cashAmountInDays: data.cashAmountInDays,
      cashOutReason: data.cashOutReason
    }
    setcashoutState(stateData)
    setActiveStep(1);

  }

  const onSignatureSubmit = async (data: any) => {

    const stateData = {
      ...cashout,
      signature: data.signature
    }
    setcashoutState(stateData)
    setActiveStep(2);

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
  const onError = () => console.log('errors, e');

  return (
    <Dialog fullScreen={fullScreen} open={props.open} onClose={props.handleClose} aria-labelledby='form-dialog-title'>
      <DialogTitle id='form-dialog-title'>{activeStep == 0 && <>Cash Out Request</>}
        {activeStep == 1 && <>Sign your contract</>}
        {activeStep == 2 && <>Success</>}
      </DialogTitle>
      {activeStep == 0 &&
        <><Container maxWidth="lg"><form key='cashoutform' onSubmit={handleCashOutSubmit(onCashOutSubmit, onError)}>


          <DialogContent>
            <FormControl fullWidth>

              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',
              }}>
                <Item>Days Available:</Item>
                <Item>{store.cashoutOption!=null && store.cashoutOption?.daysAvailable!=null && store.cashoutOption?.daysAvailable.toFixed(2)}</Item>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',

              }}>
                <Item>Value (Before tax):</Item>
                <Item> {store.cashoutOption!=null && store.cashoutOption?.cashoutAmount!=null&& '$' + store.cashoutOption?.cashoutAmount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}</Item>
              </Box>

              <Controller
                rules={{ required: true }}
                control={cashOutControl}
                name='cashAmountInDays'
                render={({ field: { onChange } }) => (
                  <TextField id='cashAmountInDays' autoFocus fullWidth
                    label='Cash Out Amount (In Days)'
                    aria-describedby='cashAmountInDays'
                    onChange={onChange}
                    error={Boolean(cashOutErrors.cashAmountInDays)}
                  />
                )}
              />
              {cashOutErrors.cashAmountInDays && (
                <FormHelperText sx={{ color: 'error.main' }} id='cashAmountInDays'>
                  Required
                </FormHelperText>
              )}

              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',

              }}>
                <Item>Cash Amount (Before tax):</Item>
                <Item>Item value Before</Item>
              </Box>
              <Box sx={{
                display: 'flex',
                alignItems: 'flex-start',

              }}>
                <Item>Leave Balance After Cash Out:</Item>
                <Item>Item value After</Item>
              </Box>


              <Controller
                rules={{ required: true }}
                control={cashOutControl}
                name='cashOutReason'
                render={({ field: { onChange } }) => (

                  <TextField id='cashOutReason' autoFocus fullWidth
                    label='Cash Out Reason'
                    placeholder=''
                    aria-describedby='cashOutReason'
                    onChange={onChange}
                    multiline
                    error={Boolean(cashOutErrors.cashOutReason)}
                  />
                )}
              />
              {cashOutErrors.cashOutReason && (
                <FormHelperText sx={{ color: 'error.main' }} id='cashOutReason'>
                  Required
                </FormHelperText>
              )}
            </FormControl>
          </DialogContent>
          <DialogActions className='dialog-actions-dense'>
            <Button type='submit' variant="contained"> Cash Out Leave</Button>

          </DialogActions>
        </form></Container>

        </>
      }
      {activeStep == 1 &&
        <form key='signature-submit' onSubmit={handleSignatureSubmit(onSignatureSubmit, onError)}>

          <DialogContent>
            <DialogContentText>
              In order to cashout excess leave we require as signed agreement betwen both parties
              being you and your employer.Once both parties execute the document you will recieve asigned copy.
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
            <Button type='submit' variant="contained">Sign Contract</Button>
          </DialogActions>
        </form>
      }
      {activeStep == 2 &&
        <> <DialogContent>
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
