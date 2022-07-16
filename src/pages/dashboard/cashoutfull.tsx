// ** React Imports
import { Fragment, SyntheticEvent, useState } from 'react'
// ** MUI Imports
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Box, { BoxProps } from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { postEmployeeCashout } from 'src/store/employee';
import React from 'react'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { CardContent, Card, Grid, CardHeader, Container, FormHelperText, IconButton, useMediaQuery, useTheme } from '@mui/material'
import { Eraser } from 'mdi-material-ui'
import SignaturePad from 'react-signature-canvas';

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

const cashout = () => {
  let sigCanvas = React.useRef() as React.MutableRefObject<any>;

  const [activeStep, setActiveStep] = React.useState(0);

  const [cashout, setcashoutState] = React.useState<CashOutState>({
    cashAmountInDays: null,
    cashOutReason: '',
    signature: ''
  });
  const store = useSelector((state: RootState) => state.employee)

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
  const onCashOutSubmit = async (data: any) => {
    console.log(data);
    var stateData = {
      ...cashout,
      cashAmountInDays: data.cashAmountInDays,
      cashOutReason: data.cashOutReason
    }
    setcashoutState(stateData)
    setActiveStep(1);

  }

  const onSignatureSubmit = async (data: any) => {
    console.log(data);
    var stateData = {
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
  debugger;

  return (
    <Card sx={{ width: 1/2 }}>
      <CardHeader title='Basic' titleTypographyProps={{ variant: 'h6' }}>Test</CardHeader>
      {activeStep == 0 &&

        <CardContent>

          <form key='cashoutform' onSubmit={handleCashOutSubmit(onCashOutSubmit, onError)}>

            <Grid container spacing={4} md={6}>
              <Grid item xs={12}  md={12}>
                <FormControl fullWidth>

                  <Controller
                    rules={{ required: true }}
                    control={cashOutControl}
                    name='cashAmountInDays'
                    render={({ field: { value, onChange } }) => (
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

                </FormControl>
              </Grid>
              <Grid item xs={12} md={12}>

                <FormControl fullWidth>

                  <Controller
                    rules={{ required: true }}
                    control={cashOutControl}
                    name='cashOutReason'
                    render={({ field: { value, onChange } }) => (

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
              </Grid>
              <Grid item xs={12} lg={12}>
                <Button type='submit' variant="contained"> Cash Out Leave</Button>
              </Grid>
            </Grid>

          </form>

        </CardContent >

      }
      {
        activeStep == 1 &&
        <CardContent>
          <form key='signature-submit' onSubmit={handleSignatureSubmit(onSignatureSubmit, onError)}>

            <div>
              In order to cashout excess leave we require as signed agreement betwen both parties
              being you and your employer.Once both parties execute the document you will recieve asigned copy.
            </div>
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
            <Button type='submit' variant="contained">Sign Contract</Button>
          </form >
        </CardContent>
      }

      {
        activeStep == 2 &&
        <CardContent>
          <div>
            Thank you for using bit.leave!

            You will recieve a notification once your leave cash out has been approved.
            You will be able to view this contract in your 'My contracts & History' section.
          </div> </CardContent>

      }
    </Card >

  )


}
export default cashout
