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
import Box from '@mui/material/Box'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import React from 'react'
import FormControl from '@mui/material/FormControl'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import { Card, CardContent, CardHeader, Divider, FormHelperText, IconButton, InputAdornment, Typography, useMediaQuery, useTheme } from '@mui/material'
import { Eraser, Close } from 'mdi-material-ui'
import SignaturePad from 'react-signature-canvas';
import { calculateEmployeeCashout, getCashOutContract, postEmployeeCashout } from 'src/store/employee'
import { ApiResult, error } from 'src/types/error'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { clippingParents } from '@popperjs/core';

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
	const [leaveBalanceAfterCashout, setleaveBalanceAfterCashout] = React.useState(null)
	const [toggleValue, setToggleValue] = React.useState(false)
	const [calculateData, setCalculateData] = React.useState<any>('')

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
	const sigCanvas = React.useRef() as React.MutableRefObject<any>;
	const store = useSelector((state: RootState) => state.employee)

	const onCashOutSubmit = async (data: any) => {
		setloading(true)

		const stateData = {
			...cashout,
			cashoutdays: data.cashoutdays,
			cashoutreason: data.cashoutreason
		}
		setcashoutState(stateData)

		const cashoutContractResponse = await dispatch(getCashOutContract(stateData))
		if (cashoutContractResponse.payload !== null) {
			setemployeeContract(cashoutContractResponse.payload)
			setActiveStep(1);
			resetError()
			setloading(false)
			setToggleValue(false);
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
		const result = await dispatch(postEmployeeCashout(stateData))
		if (result.payload) {
			setcashoutState(result.payload)
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
	const onError = (e: any) => {return ''};

	const onChangeCashOutDays = async (e: any) => {
		if (e.target.value != null) {
			setloading(true)
			setToggleValue(true)
			const result = await dispatch(calculateEmployeeCashout(parseInt(e.target.value)))
			if (result.payload != null) {
					if (result.payload.cashoutAmount != null) {
					setCalculateData(result.payload)
					setcalculateAmount(result.payload.cashoutAmount)
					setleaveBalanceAfterCashout(result.payload.leaveBalanceAfterCashout)

				}
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
				return <Alert key={i} variant="outlined" severity="error" sx={{marginBottom: '20px'}}>{x.message}</Alert>
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
					<form key='cashoutform' onSubmit={handleCashOutSubmit(onCashOutSubmit, onError)} style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
						<DialogContent dividers={true}>
							{cashoutApiResponse.errors != null && errorControl()}

							<FormControl fullWidth>
								<Box sx={{
									display: 'flex',
									alignItems: 'flex-start',
									pb: '1.25rem',
								}}>
									<TextField
										fullWidth
										type='string'
										label='Days Available'
										name='Days Available'
										value={store.cashoutOption != null && store.cashoutOption?.daysAvailable != null && store.cashoutOption?.daysAvailable.toFixed(2)}
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
								<Box sx={{
									display: 'flex',
									alignItems: 'flex-start',
									pb: '1.25rem',
								}}>
									<TextField
										fullWidth
										type='string'
										label='Value (Before tax)'
										name='Value (Before tax)'
										value={store.cashoutOption != null && store.cashoutOption?.cashoutAmount != null && store.cashoutOption?.cashoutAmount.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
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

								{toggleValue && calculateAmount ?
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
												sx={{ mt: '1.25rem' }}

											/>
											)}
											/>
									 : ''} 
								{toggleValue && calculateAmount ? cashOutErrors.cashoutreason && (
									<FormHelperText id='cashoutreason' sx={{ color: 'error.main' }} >
										Required
									</FormHelperText>
								) : ""}

								{toggleValue && calculateAmount ?
								<Card sx={{marginTop:'1.50rem'}}>
								<CardContent >
									<Box sx={{ py: 1.25, display: 'flex', alignItems: 'center' }}>
										<AttachMoneyIcon sx={{ color: 'primary.main', mr: 2.5, fontSize: 'medium' }} />
										<Typography variant='body2'>Cashout Amount</Typography> <Typography variant='body2' marginLeft={'43px'}>{calculateData?.cashoutAmount?.toFixed(2)}</Typography> 
									</Box>
									<Box sx={{  display: 'flex', alignItems: 'center' }}>
										<AttachMoneyIcon sx={{ color: 'primary.main', mr: 2.5, fontSize: 'medium' }} />
										<Typography variant='body2'>Tax  </Typography><Typography variant='body2' marginLeft={'138px'}>{calculateData?.taxAmount?.toFixed(2)} </Typography>
									</Box>
									<Divider></Divider>
									<Box sx={{  display: 'flex', alignItems: 'center' }}>
										<AttachMoneyIcon sx={{ color: 'primary.main', mr: 2.5, fontSize: 'medium' }} />
										<Typography variant='body2'>Total Amount  </Typography><Typography variant='body2' marginLeft={'73px'}>{calculateData?.totalAmount?.toFixed(2)} </Typography>
									</Box>
								</CardContent>
								</Card>

								: ""}

							</FormControl>
						</DialogContent>
						<DialogActions disableSpacing={true} className='dialog-actions-dense'>
							{loading == false && 
								<Button type='submit' variant="contained" style={{ marginTop: '0.75em' }} disabled={calculateAmount === 0 || calculateAmount === null}> Cash Out Leave</Button>
							}
							{loading == true &&
								<LoadingButton style={{ marginTop: '0.75em' }} loading={loading} variant="contained" disabled>
									Cash Out Leave
								</LoadingButton>
							}

						</DialogActions>
					</form>

				</>
			}
			{activeStep == 1 &&
				<form key='signature-submit' onSubmit={handleSignatureSubmit(onSignatureSubmit, onError)} style={{ overflowY: "auto", display: "flex", flexDirection: "column" }}>
					<DialogContent dividers={true}>
						{cashoutApiResponse.errors != null && errorControl()}

						<DialogContentText>
							In order to cashout excess leave we require as signed agreement betwen both parties
							being you and your employer.Once both parties execute the document you will recieve asigned copy.
						</DialogContentText>
						<DialogContentText>
							<span dangerouslySetInnerHTML={displayContract()} />
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
								Sign ggContract
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
