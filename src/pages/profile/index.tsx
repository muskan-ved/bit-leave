// ** React Imports
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import { Typography, Box, Grid, CardHeader, Card, CardContent, Divider, styled, AvatarProps, Button, TextField, InputAdornment, CircularProgress, Tabs, TableContainer,Table,TableBody,TableCell,TableHead,TableRow,Paper, tableCellClasses } from '@mui/material';
import Avatar from '@mui/material/Avatar';

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

//  ** MUI Icon Import
import Tab from '@mui/material/Tab'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BusinessIcon from '@mui/icons-material/Business';
import ApartmentIcon from '@mui/icons-material/Apartment';

// ** Redux Import
import { useDispatch } from 'react-redux'

//  ** Store Import
import { loadEmployee } from 'src/store/employee';
import { AppDispatch } from 'src/store';

// ** SDK Import
import AWS from 'aws-sdk';

// ** Config Import
import auth from 'src/configs/auth';

// ** Import Toaster
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { putAvatar } from 'src/store/profile';
import LoadingButton from '@mui/lab/LoadingButton';


// ** Styled Avatar component
const CusAvatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
	width: 50,
	height: 50,
}))

const AvatarPersona = styled(Avatar)(({ theme }) => ({
	width: 60,
	height: 60,
	'&.active': {
		border:`4px solid ${theme.palette.primary.main}`
	}
}))


interface TabPanelProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

const Profile = () => {

	const [imagePreviewUrl, setImagePreviewUrl] = useState('');
	const [value, setValue] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [loading, setLoading] = useState<boolean>(false)
	const [employeeData, setemployeeData] = useState<any>('')
	const ability = useContext(AbilityContext)
	const dispatch = useDispatch<AppDispatch>()
	const userData = localStorage.getItem("userData")
	const getTabList = ['Profile Detail', 'Direct Reports', 'Team','Avatar']
	const personaList = ['/images/avatars/one.png', '/images/avatars/two.png', '/images/avatars/three.png','/images/avatars/four.png','/images/avatars/five.png','/images/avatars/six.png','/images/avatars/seven.png','/images/avatars/eight.png'];
	const [classadd, setClassAdd] = React.useState('');
	const [imageName, setImageName] = React.useState('');
		
	const S3_BUCKET = auth.bucket_image_name;
	const REGION = auth.region;
	
	AWS.config.update({
		accessKeyId: auth.accessKeyId,
		secretAccessKey: auth.secretAccessKey,
	})
	
	const myBucket = new AWS.S3({
		params: { Bucket: S3_BUCKET },
		region: REGION,
	})

	function TabPanel(props: TabPanelProps) {
		const { children, value, index, ...other } = props;

		return (
			<div
				role="tabpanel"
				hidden={value !== index}
				id={`simple-tabpanel-${index}`}
				aria-labelledby={`simple-tab-${index}`}
				{...other}
			>
				{value === index && (
					<Box sx={{ p: 3 }}>
						<Typography variant='subtitle2'>{children}</Typography>
					</Box>
				)}
			</div>
		);
	}

	function a11yProps(index: number) {
		return {
			id: `simple-tab-${index}`,
			'aria-controls': `simple-tabpanel-${index}`,
		};
	}

	const handleChangeTab = (event: SyntheticEvent, newValue: number) => {
		if (event) { }
		setValue(newValue)
	}

	let profileData:any;
	if (userData != null) {
		profileData = JSON.parse(userData)
	}

	const fetchDataFromRedux = async () => {

		const empData = await dispatch(loadEmployee())
		if (empData.payload != null) {
			setemployeeData(empData.payload.data);
		}
		setIsLoading(false)
	}

	useEffect(() => {
		
		if (!employeeData) {
			setIsLoading(true);
			fetchDataFromRedux();
		}
	}, []);

	const handleOnChangePersona = async (event: any) => {
		event.preventDefault();
		const imageName = event.target.alt.substring(event.target.alt.lastIndexOf('/') + 1)
		setClassAdd(event.target.alt);	
		setImageName(imageName)
	}

	const handleSubmitPersona = async () =>{
	
		if(imageName !== ''){
		setLoading(true)
		await dispatch(putAvatar(imageName)).then((response:any) => {
                        if (response.payload !== undefined) {
                          toast.success('Avatar Uploaded. Please navigate to dashboard, it will be updated shortly')
						  localStorage.setItem('avatar',imageName)
                          setLoading(false)
                        }else{
                          toast.error('Failed to update the Avatar')
                          setLoading(false)
                        }
                      })
                      .catch((err:any) => {
						toast.error('Failed to update the Avatar')
						setLoading(false)
					})
				}
	}
	
	const handleOnChange = async (event: any) => {
		event.preventDefault();
		if (event.target.files[0]) {
			const reader = new FileReader();
			const file = event.target.files[0];

				const userData = localStorage.getItem("userData")
				let OrgId;
				if (userData != null) {
				  const data = JSON.parse(userData)
				  OrgId = data.orgId;
				}  

				const fileName = (event.target.files[0].name.replace(event.target.files[0].name), `logo`)
			
				const params = {
					Bucket: S3_BUCKET,
					Key: `${OrgId}/${fileName}`,
					Body: file,
				}
				 myBucket.upload(params, (err:any, data:any) =>{
					if(data){
						reader.onloadend = (e: any) => {
							const image = e.target.result
							setImagePreviewUrl(image);
						};
						reader.readAsDataURL(file);
    					window.localStorage.setItem('orgLogo', '1')
						toast.success(`Organisation Logo Uploaded. Please navigate to dashboard, it will be updated shortly`)
					}else{
						toast.error("Failed to Upload Organisation Logo")
					}
					})
		}
	}

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
     
	  backgroundColor: theme.palette.primary.main,
		  color: theme.palette.common.black,
		 
		},
		[`&.${tableCellClasses.body}`]: {
		  fontSize: 14,
		},
	  }));

	if (isLoading)
		return (<CircularProgress color="success" />)

	return (<>
		<Grid container spacing={5}>
			<ToastContainer/>
			<Grid item xs={12} >
				<Card>
					<CardHeader title='Your Profile Details' subheader={<Divider></Divider>} />
					<Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
						{getTabList && getTabList?.map((data: string, i: any) =>
							<Tab label={data} key={i} {...a11yProps(i)} />
						)}
					</Tabs>
					<TabPanel value={value} index={0} >
						<CardContent >
							<Grid container spacing={5}>
								<Grid item xs={12} >
									<TextField
										fullWidth
										type='string'
										label='First Name'
										name='First Name'
										defaultValue={employeeData && employeeData.profile?.firstname}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<PersonOutlineIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='Last Name'
										name='Last Name'
										defaultValue={employeeData && employeeData.profile?.lastname}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<PersonOutlineIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='User Name'
										name='User Name'
										defaultValue={profileData?.username}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<PersonOutlineIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='Full Name'
										name='Full Name'
										defaultValue={employeeData && employeeData.profile?.fullname}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<PersonOutlineIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='Organisation Name'
										name='Organisation Name'
										defaultValue={profileData?.companyname}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<BusinessIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='Email'
										name='Email'
										defaultValue={employeeData && employeeData.profile?.email}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<MailOutlineIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</TabPanel>
					<TabPanel value={value} index={1}>
						<CardContent>
							<Box sx={{  width: '100%' }} >
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
									<TableRow >
										<StyledTableCell>Full Name</StyledTableCell>
										<StyledTableCell align="right">Department</StyledTableCell>
									</TableRow>
									</TableHead>
									<TableBody>
									{employeeData && employeeData?.directReports?.directReports?.map((row:any,i:number) => (
										<TableRow
										key={i}
										sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
										>
										<StyledTableCell component="th" scope="row">{row.fullname}</StyledTableCell>
										<StyledTableCell align="right">{row.department}</StyledTableCell>
										</TableRow>
									))}
									</TableBody>
								</Table>
								</TableContainer>
							</Box>
							
						</CardContent>
					</TabPanel>
					<TabPanel value={value} index={2}>

					<CardContent>
							<Grid container spacing={5}>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='Manager Name'
										name='Manager Name'
										defaultValue={employeeData && employeeData.profile.managerName}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<PersonOutlineIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
								<Grid item xs={12}>
									<TextField
										fullWidth
										type='string'
										label='Department'
										name='Department'
										defaultValue={employeeData && employeeData.profile.department}
										InputProps={{
											readOnly: true,
											startAdornment: (
												<InputAdornment position='start'>
													<ApartmentIcon />
												</InputAdornment>
											)
										}}
									/>
								</Grid>
							</Grid>
						</CardContent>
					</TabPanel>
					<TabPanel value={value} index={3} >
					{/* <CardHeader title='Choose your avatar​​'/> */}
					<CardContent>
					<Typography variant='body2' sx={{marginBottom:'20px'}}>Choose your avatar​</Typography>
					<Grid container spacing={5} >
					{personaList.map((item,index)=> {
						return (
					<Grid item xs={2} key={index}  marginLeft={'3.3%'} >
						<AvatarPersona src={item} key={index} className={item === classadd ? 'active' : ''} alt={item} onClick={handleOnChangePersona} />
					</Grid>
					) })}
					<Grid item xs={12}>
					{!loading ? <Button type='submit' variant='contained' size='large' onClick={handleSubmitPersona}  disabled={imageName === '' ? true : false}>
						Update
						</Button> :
						<LoadingButton loading={loading} size='large' type='submit' variant='contained' disabled>
						Update
						</LoadingButton>
					}
					</Grid>
					</Grid>
					</CardContent>
					</TabPanel>
				</Card>
			</Grid>
			{ability?.can('read', 'analytics') ? (
				<Grid item xs={12} >
					<Card>
						<CardHeader title='Upload your organisation logo ' subheader={<Divider></Divider>}></CardHeader>
						<CardContent sx={{ m: 3, p: 3 }} >
							<Box sx={{ width: '100%' }}>
								{imagePreviewUrl ? <CusAvatar src={imagePreviewUrl} skin='light' variant='rounded' sx={{ width: 100, height: 100 }} /> : null}
							</Box>
						</CardContent>

						<Typography variant='body1' component='p' sx={{ ml: 3, pl: 3, pb: 2, fontSize: '12px' }}>
							The size of the Organisation logo should be 500*500.
						</Typography>
						<Box sx={{ ml: 3, pl: 3, pb: 4 }} className="btndivider">
							<Button variant="contained" component="label" >
								Upload Organisation Logo
								<input style={{ marginLeft: 60 }} type={"file"} id={"logo"} onChange={handleOnChange} onClick={(event:any)=> {event.target.value = null}} accept='image/*' hidden />
							</Button>

						</Box>
					</Card>
				</Grid>
			) : ""}

		</Grid>
	</>
	);
}

Profile.acl = {
	action: 'read',
	subject: 'profile'
}


export default Profile;
