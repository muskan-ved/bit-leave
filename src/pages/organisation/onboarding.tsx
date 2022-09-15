
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import SignaturePad from 'react-signature-canvas';
import React, { ReactNode } from 'react';
import { Box, BoxProps, Button, Card, CardContent, FormControl, FormControlLabel, FormHelperText, Grid, IconButton, List, ListItem, ListItemIcon, ListItemText, Radio, RadioGroup, styled, TextField, Typography } from '@mui/material';
import Link from 'next/link';
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Paper from '@mui/material/Paper';
import { Check, Eraser } from 'mdi-material-ui';
import { postOrgOnboarding, xeroReturlUrl } from 'src/store/onboarding';
import { AppDispatch } from 'src/store';
import { useDispatch } from 'react-redux'
import BlankLayoutWithAppBarWrapper from 'src/@core/layouts/BlankLayoutWithAppBar';
import { useRouter } from 'next/router';
import CustomAvatar from 'src/@core/components/mui/avatar'
import { loadOrganisation } from 'src/store/organisation';

const StepperWrapper = styled(Box)<BoxProps>(({ theme }) => ({
	padding: theme.spacing(7)
}))

const StepperContentWrapper = styled(Box)<BoxProps>(({ theme }) => ({
	padding: theme.spacing(7)
}))
interface OnBoardingState {
	compliance: string,
	leaveNotification: number | null,
	leaveWarning: number | null,
	maxPayout: number | null,
	email: string,
	payrollEmail: string,
	payrollLink: string,
	approval: string,
	signature: string,
	tenantId: string
}


const defaultComplianceValue = {
	compliance: ''
}

const defaultThresholdValue = {
	leaveNotification: '',
	leaveWarning: '',
	maxPayout: ''
}

const defaultcontactValue = {
	email: '',
	payrollEmail: '',
	payrollLink: ''
}

const defaultApprovalValue = {
	approval: '',
	signature: ''
}

const defaultTenantIdValue = {
	tenantId: ''
}

const complianceSchema = yup.object().shape({
	compliance: yup.string().required()
})

const thresholdSchema = yup.object().shape({
	leaveNotification: yup.number().required(),
	leaveWarning: yup.number().required(),
	maxPayout: yup.number().required()
})

const contactSchema = yup.object().shape({
	email: yup.string().required(),
	payrollEmail: yup.string().required(),
	payrollLink: yup.string().required()
})

const approvalSchema = yup.object().shape({
	approval: yup.string().required(),
	signature: yup.string().
		when('approval', {
			is: (approval: string) => approval === 'automatic',
			then: yup.string()
				.required()
		})
})

const tenantIdSchema = yup.object().shape({
	tenantId: yup.string().required()
})


const Onboarding = () => {

	const steps = ['Start', 'Contacts', 'Approval', 'Connect to XERO','Choose Tenant Id'];
	const [activeStep, setActiveStep] = React.useState(0);
	const [buttonToggle, setButtonToggle] = React.useState(false);
	const router = useRouter()
	const [onBoarding, setOnBoardingState] = React.useState<OnBoardingState>({
		compliance: '',
		leaveNotification: null,
		leaveWarning: null,
		maxPayout: null,
		email: '',
		payrollEmail: '',
		payrollLink: '',
		approval: '',
		signature: '',
		tenantId:''
	});

	const sigCanvas = React.useRef() as React.MutableRefObject<any>;

	// ** Hooks
	const {
		control: complianceControl,
		handleSubmit: handleComplianceSubmit,
		watch: watchCompliance,
		formState: { errors: complianceErrors }
	} = useForm({
		defaultValues: defaultComplianceValue,
		resolver: yupResolver(complianceSchema)
	})

	const {
		control: thresholdControl,
		handleSubmit: handlethresholdSubmit,
		watch: watchThreshold,
		formState: { errors: thresholdErrors }
	} = useForm({
		defaultValues: defaultThresholdValue,
		resolver: yupResolver(thresholdSchema)
	})

	const {
		control: contactControl,
		handleSubmit: handleContactSubmit,
		formState: { errors: contactErrors }
	} = useForm({
		defaultValues: defaultcontactValue,
		resolver: yupResolver(contactSchema)
	})

	const {
		control: approvalControl,
		handleSubmit: handleApprovalSubmit,
		watch: watchApproval,
		reset: approvalReset,
		formState: { errors: approvalErrors }
	} = useForm({
		defaultValues: defaultApprovalValue,
		resolver: yupResolver(approvalSchema)
	})

	const {
		control: tenantIdControl,
		handleSubmit: handleTenantIdSubmit,
		// watch: watchTenantId,
		formState: { errors: tenantIdErrors }
	} = useForm({
		defaultValues: defaultTenantIdValue,
		resolver: yupResolver(tenantIdSchema)
	})

	const handleNext = () => { setActiveStep((prevActiveStep) => prevActiveStep + 1); };
	const handlePrevious = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1);setButtonToggle(false) };

	const dispatch = useDispatch<AppDispatch>()


	const getComplianceContent = () => {
		switch (complianceSelected) {
			case 'award':
				return (<Paper elevation={0}>
					<Typography variant="subtitle2" sx={{ pl: 8 }}>
						Most awards stipulate that when cashing out excess leave that:
						<List >
							<ListItem sx={{ pt: 0, pb: 0 }} >1.
								<ListItemText secondary={"At least 4 weeks annual leave must be left after the cash out."} sx={{ marginLeft: '4px' }}></ListItemText>
							</ListItem>
							<ListItem sx={{ pt: 0, pb: 0 }}>2.
								<ListItemText secondary={"An employee can't cash out more than 2 weeks each 12 months."} sx={{ marginLeft: '4px' }}></ListItemText>
							</ListItem>
						</List>
						<Typography variant="subtitle2" component="div" gutterBottom >
							You can find your relevant award <Link target={"_blank"} href={"https://google.com"} style={{ color: 'red !important' }} >Here</Link> and find your excess leave cash out rules <Link target={"_blank"} href={"https://google.com"} >Here</Link>.
						</Typography>
					</Typography>
				</Paper>)
			case 'enterpriseAgreement':
				return (
					<Typography variant="subtitle2" component="div" sx={{ pl: 8 }}>
						Generic excess leave cash out rules for Enterprise Agreements:
						<List>
							<ListItem sx={{ pt: 0, pb: 0 }}>1.
								<ListItemText secondary={"Annual leave can only be cashed out when a registered agreement allows it."} sx={{ marginLeft: '4px' }}></ListItemText>
							</ListItem>
							<ListItem sx={{ pt: 0, pb: 0 }}>2.
								<ListItemText secondary={"An employee need to have at least 4 weeks annual leave left over."} sx={{ marginLeft: '4px' }}></ListItemText>
							</ListItem>
						</List>
						<Typography variant="subtitle2" component="div" gutterBottom >
							You will need to confirm that your agreement allows cash out.
						</Typography>
					</Typography>

				)
			case 'awardFree':
				return (
					<Typography variant="subtitle2" component="div" sx={{ pl: 8 }} >
						An award and agreement free employee can make an agreement with their employer
						to cash out their annual leave.
						<List>
							<ListItem sx={{ pt: 0, pb: 0 }}>If:
								<ListItemText secondary={"An employee need to have at least 4 weeks annual leave left over."} sx={{ marginLeft: '4px' }}></ListItemText>
							</ListItem>
						</List>
						<Typography variant="subtitle2" component="div" gutterBottom>
							You can learn more about cash out rules <Link target={"_blank"} href={"https://google.com"}>Here.</Link>
						</Typography>
					</Typography>
				)
			default:
				return (null);
		}
	}
	const startOnBoarding = () => {
		return (<Grid container spacing={5}>
			<Grid item xs={12}>
				<Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }} gutterBottom>

					Let's Get Started
				</Typography>
				<Typography variant="body1" component="div" gutterBottom>
					Our onboarding process placeholder
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Button type='submit' variant="contained" onClick={onStart}>
					{activeStep === 0 ? 'Start' : 'Next'}
				</Button>
			</Grid>
		</Grid>)

	}

	const complianceSelected = watchCompliance('compliance')
	// const tenantIdSelected = watchTenantId('tenantId')
	const approvalSelected = watchApproval()

	const onComplianceSubmit = (data: any) => {
		const stateData = {
			...onBoarding,
			compliance: data.compliance
		}
		setOnBoardingState(stateData)
		handleNext()
	}

	const onThresholdSubmit = (data: any) => {
		const stateData = {
			...onBoarding,
			leaveNotification: data.leaveNotification,
			leaveWarning: data.leaveWarning,
			maxPayout: data.maxPayout
		}
		setOnBoardingState(stateData)
		handleNext()
	}
	const onStart = () => {
		handleNext()
	}

	const onContactSubmit = (data: any) => {
		const stateData = {
			...onBoarding,
			email: data.email,
			payrollEmail: data.payrollEmail,
			payrollLink: data.payrollLink
		}

		setOnBoardingState(stateData)
		handleNext()
	}

	const onApprovalSubmit = async (data: any) => {
		const stateData = {
			...onBoarding,
			approval: data.approval,
			signature: data.signature
		}
		setOnBoardingState(stateData)
		handleNext()

	}

	const onXeroSubmit = async (data: any) => {
		const stateData = {
			...onBoarding,
		}
		setOnBoardingState(stateData)
		handleNext()

	}

	const onTenantIdSubmit = async (data:any) => {
		const stateData = {
			...onBoarding,
			 tenantId: data.tenantId,
		}
		setOnBoardingState(stateData)
		// await dispatch(postOrgOnboarding(
			//   stateData
		// ))
		// await dispatch(loadOrganisation())
		// router.push('/home')
	}
	
	const formatIntoPng = () => {
		if (sigCanvas.current) {
			const dataURL = sigCanvas.current.toDataURL();
			return dataURL;
		}
	}
	const onClearSignature = () => {
		sigCanvas.current.clear()
		approvalReset({
			...approvalSelected,
			signature: ''
		})
	}

	// Connect to XERO Step
	const onXeroRedirectURL = async () => {
		setButtonToggle(true)
		const xeroo = await dispatch(xeroReturlUrl())
		if (xeroo.payload) {
			console.log(xeroo, "response")

		} else {
			console.log("errr")
		}
	}

	//  Step back on preview step
	// onXeroStepBack

	const onError = () => { };
	const getStepContent = (step: number) => {
		switch (step) {
			case 0:
				return (startOnBoarding())
			// case 1:
			//   return (
			//     <form key={0} onSubmit={handleComplianceSubmit(onComplianceSubmit, onError)}>
			//       <Grid container spacing={5}>
			//         <Grid item xs={12} >
			//           <Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }} gutterBottom >
			//             Compliance
			//           </Typography>
			//           <Typography variant='body2' sx={{pt:0}} >
			//             Are your employees on an award, enterprise agreement or award free?
			//           </Typography>
			//         </Grid>
			//         <Grid item xs={12}>
			//           <FormControl fullWidth >
			//             <Controller
			//               rules={{ required: true }}
			//               control={complianceControl}
			//               name="compliance"
			//               render={({ field: { value, onChange } }) => (
			//                 <RadioGroup row={true}
			//                   value={value}
			//                   onChange={onChange}>
			//                   <FormControlLabel
			//                     value="award"
			//                     control={<Radio />}
			//                     label="Award"
			//                   />
			//                   <FormControlLabel
			//                     value="enterpriseAgreement"
			//                     control={<Radio />}
			//                     label="Enterprise Agreement"
			//                   />
			//                   <FormControlLabel
			//                     value="awardFree"
			//                     control={<Radio />}
			//                     label="Award Free"
			//                   />
			//                 </RadioGroup>
			//               )}
			//             />
			//             {complianceErrors.compliance && (
			//               <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
			//                 This field is required
			//               </FormHelperText>
			//             )}
			//           </FormControl>
			//           {getComplianceContent()}
			//           </Grid>
			//         <Grid item xs={12}>
			//           <Button type='submit' variant="contained">
			//             {activeStep === 0 ? 'Start' : 'Next'}
			//           </Button>
			//         </Grid>
			//       </Grid>
			//     </form>
			//   )
			// case 2:
			//   return (
			//     <form key={0} onSubmit={handlethresholdSubmit(onThresholdSubmit, onError)}>
			//       <Grid container spacing={5}>
			//         <Grid item xs={12}>
			//           <Typography variant='h5' gutterBottom sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>
			//             Thresholds
			//           </Typography>
			//           <Typography variant='body2' gutterBottom >
			//             What are the thresholds you would like to set?
			//             <br />
			//             Don't worry you can change these in your dashboard.
			//           </Typography>
			//         </Grid>

			//         <Grid item xs={12} md={8}>
			//           <Grid container spacing={6}>
			//             <Grid item xs={12} md={8}>
			//               <FormControl fullWidth>
			//                 <Controller
			//                   name='leaveNotification'
			//                   control={thresholdControl}
			//                   rules={{ required: true }}
			//                   render={({ field: { value, onChange } }) => (
			//                     <TextField id='leaveNoti'
			//                       value={value}
			//                       label='Excess Leave Notification (in days)'
			//                       onChange={onChange}
			//                       error={Boolean(thresholdErrors.leaveNotification)}
			//                       placeholder=''
			//                       aria-describedby='excessleave-notification'
			//                     />
			//                   )}
			//                 />
			//                 {thresholdErrors.leaveNotification && (
			//                   <FormHelperText sx={{ color: 'error.main' }} id='excessleave-notification'>
			//                     Required
			//                   </FormHelperText>
			//                 )}
			//               </FormControl>
			//             </Grid>

			//             <Grid item xs={12} md={8}>
			//               <FormControl fullWidth>
			//                 <Controller
			//                   name='leaveWarning'
			//                   control={thresholdControl}
			//                   rules={{ required: true }}
			//                   render={({ field: { value, onChange } }) => (
			//                     <TextField
			//                       value={value}
			//                       label='Excess Leave Warnings (in days)'
			//                       onChange={onChange}
			//                       error={Boolean(thresholdErrors.leaveWarning)}
			//                       placeholder=''
			//                       aria-describedby='excessleave-warning'
			//                     />
			//                   )}
			//                 />
			//                 {thresholdErrors.leaveWarning && (
			//                   <FormHelperText sx={{ color: 'error.main' }} id='excessleave-warning'>
			//                     Required
			//                   </FormHelperText>
			//                 )}
			//               </FormControl>
			//             </Grid>
			//             <Grid item xs={12} md={8}>

			//               <FormControl fullWidth>
			//                 <Controller
			//                   name='maxPayout'
			//                   control={thresholdControl}
			//                   rules={{ required: true }}
			//                   render={({ field: { value, onChange } }) => (
			//                     <TextField
			//                       value={value}
			//                       label='Maximum leave cash out every 12 months (in days)'
			//                       onChange={onChange}
			//                       error={Boolean(thresholdErrors.maxPayout)}
			//                       placeholder=''
			//                       aria-describedby='maxPayout'
			//                     />
			//                   )}
			//                 />
			//                 {thresholdErrors.maxPayout && (
			//                   <FormHelperText sx={{ color: 'error.main' }} id='maxPayout'>
			//                     Required
			//                   </FormHelperText>
			//                 )}
			//               </FormControl>

			//             </Grid>
			//           </Grid>

			//         </Grid>
			//         <Grid item xs={12} md={6}>
			//           <Button type='submit' variant="contained">
			//             {activeStep === 0 ? 'Start' : 'Next'}
			//           </Button>
			//         </Grid>
			//       </Grid>

			//     </form>

			//   )
			case 1:
				return (<form key={1} onSubmit={handleContactSubmit(onContactSubmit, onError)}>
					<Grid container spacing={5}>
						<Grid item xs={12}>
							<Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }} gutterBottom>
								Contacts
							</Typography>
							<Typography variant='body2' gutterBottom>
								Who are the key contact in the leave management process?
							</Typography>
						</Grid>
						<Grid item xs={12} md={8}>
							<Grid container spacing={6}>
								<Grid item xs={12} md={8}>
									<FormControl fullWidth>
										<Controller
											name='email'
											control={contactControl}
											rules={{ required: true }}
											render={({ field: { value, onChange } }) => (
												<TextField
													value={value}
													type='email'
													label='HR Email'
													onChange={onChange}
													error={Boolean(contactErrors.email)}
													placeholder=''
													aria-describedby='hr-email'
												/>
											)}
										/>
										{contactErrors.email && (
											<FormHelperText sx={{ color: 'error.main' }} id='hr-email'>
												Required
											</FormHelperText>
										)}
									</FormControl>
								</Grid>
								<Grid item xs={12} md={8}>
									<FormControl fullWidth>
										<Controller
											name='payrollEmail'
											control={contactControl}
											rules={{ required: true }}
											render={({ field: { value, onChange } }) => (
												<TextField
													value={value}
													type='email'
													label='Payroll Email'
													onChange={onChange}
													error={Boolean(contactErrors.payrollEmail)}
													placeholder=''
													aria-describedby='payroll-email'
												/>
											)}
										/>
										{contactErrors.payrollEmail && (
											<FormHelperText sx={{ color: 'error.main' }} id='payroll-email'>
												Required
											</FormHelperText>
										)}
									</FormControl>
								</Grid>


								<Grid item xs={12} md={8}>
									<FormControl fullWidth>
										<Controller
											name='payrollLink'
											control={contactControl}
											rules={{ required: true }}
											render={({ field: { value, onChange } }) => (
												<TextField
													value={value}
													label='HRIS login link'
													onChange={onChange}
													error={Boolean(contactErrors.payrollLink)}
													placeholder=''
													aria-describedby='payroll-link'
												/>
											)}
										/>
										{contactErrors.payrollLink && (
											<FormHelperText sx={{ color: 'error.main' }} id='payroll-link'>
												Required
											</FormHelperText>
										)}
									</FormControl>
								</Grid>

							</Grid>
						</Grid>
						<Grid item xs={12}>
							<Button type='submit' variant="contained">
								{activeStep === 0 ? 'Start' : 'Next'}
							</Button>
						</Grid>
					</Grid>


				</form>)

			case 2:
				return (<form key={0} onSubmit={handleApprovalSubmit(onApprovalSubmit, onError)}>
					<Grid container spacing={5}>
						<Grid item xs={12}>

							<Typography variant='h5' sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }} gutterBottom>
								Approval
							</Typography>
							<Typography variant='body2' gutterBottom>
								Would you like to manually or automatically approve excess leave cash out?
							</Typography>
						</Grid>
						<Grid item xs={12}>
							<FormControl fullWidth>
								<Controller
									rules={{ required: true }}
									control={approvalControl}
									name="approval"
									render={({ field: { value, onChange } }) => (
										<RadioGroup row={true}
											value={value}
											onChange={onChange}>
											<FormControlLabel
												value="manual"
												control={<Radio />}
												label="Manual"
											/>
											<FormControlLabel
												value="automatic"
												control={<Radio />}
												label="Automatic"
											/>

										</RadioGroup>
									)}
								/>
								{approvalErrors.approval && (
									<FormHelperText sx={{ color: 'error.main' }} >
										This field is required
									</FormHelperText>
								)}
							</FormControl>
						</Grid>
						{
							approvalSelected.approval === 'manual' &&

							<Grid item xs={12}>
								<Typography variant='body2'>
									Manually approving excess leave cash out allows you to:
								</Typography>
								<List>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Review an employees reason as to why they want to take leave
										</ListItemText>

									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Checking health and welfare of the employee
										</ListItemText>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Review the cash amount before approval
										</ListItemText>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Control cashflow for the business if required
										</ListItemText>
									</ListItem>
								</List>

							</Grid>

						}
						{approvalSelected.approval === 'automatic' &&

							<Grid item xs={12}>
								<Typography variant='body2'>
									Automatically approving excess leave cash out allows you to:
								</Typography>
								<List>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Sign once (below) for all leave cash out requests
										</ListItemText>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Automate entire excess leave process
										</ListItemText>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											Saves HR and Payroll time in processing and approvals
										</ListItemText>
									</ListItem>
									<ListItem>
										<ListItemIcon>
											<Check />
										</ListItemIcon>
										<ListItemText>
											It does NOT allow you to review and approve individual requests
										</ListItemText>
									</ListItem>
								</List>
								<IconButton onClick={onClearSignature} style={{ display: 'block', position: 'relative', textAlign: 'right', left: '365px', top: '40px', 'zIndex': '100' }}>
									<Eraser></Eraser>
								</IconButton>
								<FormControl>
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
														width: 400,
														height: 100,
														style: { border: "1px solid black" },
													}}
												/>
											</>
										)}
									/>
									{approvalErrors.signature && (
										<FormHelperText sx={{ color: 'error.main' }} >
											Signature is required
										</FormHelperText>
									)}
								</FormControl>

							</Grid>
						}
						<Grid item xs={12}>
							<Button type='submit' variant="contained">
								{activeStep === 0 ? 'Start' : 'Next'}
							</Button>
						</Grid>

					</Grid>
				</form>)
			case 3:
				return (<Grid container spacing={5}>
					<Grid item xs={12} sx={{display: "flex", justifyContent: "space-between",  alignItems: "center"}}>
						<Typography variant='h5' gutterBottom sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>Connect to Xero</Typography>
						<CustomAvatar src={"/images/cards/xero_icon.png"}  variant='rounded'  sx={{ float: "right"  ,width:'50px',height:'50px'}} />
					</Grid>
					<Grid  xs={12} sx={{padding: "0px 0px 20px 20px",textAlign:"justify"}}>
						<Typography variant='body2' gutterBottom >Please click below, to link your Xero tenant with bit.leave. This will open a seperate window. Please note, you will be asked to allow bit.leave access to certain scopes (payroll etc.). This will enable bit.leave to automatically calculate excess leave amounts based on thresholds. Furthermore, please note, you will need to sign into Xero to complete the flow.</Typography>
					</Grid>
					<Grid item xs={12}>
						<Box sx={{ float: "left" }}>
							{!buttonToggle ?
							<Button type='submit' variant="contained" onClick={onXeroRedirectURL}>
								{activeStep === 0 ? 'Start' : 'Connect to XERO'}
							</Button>
							:
							<Button type='submit' variant="contained" onClick={onXeroSubmit} >
								{activeStep === 0 ? 'Start' : 'Next'}
							</Button>}
						</Box>
					</Grid>

				</Grid>)
			case 4:
				return (
				<form key={0} onSubmit={handleTenantIdSubmit(onTenantIdSubmit, onError)}>
			       <Grid container spacing={5}>
					<Grid item xs={12} sx={{display: "flex", justifyContent: "space-between",  alignItems: "center"}}>
						<Typography variant='h5' gutterBottom sx={{ mb: 1.5, fontWeight: 600, letterSpacing: '0.18px' }}>Choose Tenant Id</Typography>
						<CustomAvatar src={"/images/cards/xero_icon.png"}  variant='rounded'  sx={{ float: "right"  ,width:'50px',height:'50px'}} />
					</Grid>
					<Grid  xs={12} sx={{padding: "0px 0px 20px 20px",textAlign:"justify"}}>
						<Typography variant='body2' gutterBottom sx={{ float: "left" ,color: 'success.main'}}>Success / </Typography>
						<Typography variant='body2' gutterBottom sx={{ float: "left" ,color: 'error.main'}}>/ Error message show there.</Typography>
					</Grid>
			         <Grid item xs={12}>
			           <FormControl fullWidth >
			             <Controller
			               rules={{ required: true }}
			               control={tenantIdControl}
			               name="tenantId"
			               render={({ field: { value, onChange } }) => (
			                 <RadioGroup row={false}
			                   value={value}
			                   onChange={onChange}>
			                   <FormControlLabel
			                     value="Brett-123U"
			                     control={<Radio />}
			                     label="Brett-123U"
								 />
								
			                   <FormControlLabel
			                     value="Kushal-u234xe"
			                     control={<Radio />}
			                     label="Kushal-u234xe"
			                   />
			                   <FormControlLabel
			                     value="Vaghani-62wetx"
			                     control={<Radio />}
			                     label="Vaghani-62wetx"
			                   />
			                 </RadioGroup>
			               )}
			             />
			             {tenantIdErrors.tenantId && (
			               <FormHelperText sx={{ color: 'error.main' }} id='stepper-linear-account-username'>
			                 This field is required
			               </FormHelperText>
			             )}
			           </FormControl>
			           {/* {getComplianceContent()} */}
			           </Grid>
			         <Grid item xs={12}>
						<Box sx={{ float: "left" }}>
						<Button type='submit' variant="contained" onClick={handlePrevious} sx={{marginRight:"1rem"}}>
							{activeStep === 0 ? 'Start' : 'Back'}
						</Button>
						<Button type='submit' variant="contained" >
							{activeStep === 0 ? 'Start' : 'Finish'}
						</Button>	
					</Box>
				</Grid>
			       </Grid>
			     </form>
			   )
			default:
				break;
		}
	}

	const renderContent = () => {
		return getStepContent(activeStep)
	}
	return (

		<Grid container spacing={1}>
			<Grid item xs={2}>
				<StepperWrapper>
					<Stepper activeStep={activeStep} orientation='vertical'>
						{steps.map((label) => {
							const stepProps: { completed?: boolean; } = {};
							const labelProps: {
								optional?: React.ReactNode;
							} = {};


							return (
								<Step key={label} {...stepProps}>
									<StepLabel {...labelProps}>{label}</StepLabel>
								</Step>
							);
						})}
					</Stepper>
				</StepperWrapper>
			</Grid>
			<Grid item xs={9}>
				<Grid container>
					<Grid item xs={12}>
						<StepperContentWrapper>
							<Card>
								<CardContent>
									{renderContent()}
								</CardContent>
							</Card>
						</StepperContentWrapper>
					</Grid>

				</Grid>
			</Grid>
		</Grid>
	)
}

Onboarding.getLayout = (page: ReactNode) => <BlankLayoutWithAppBarWrapper>{page}</BlankLayoutWithAppBarWrapper>


export default Onboarding


