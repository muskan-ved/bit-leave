// ** React Imports
import React, { SyntheticEvent, useContext, useEffect, useState } from 'react';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import { Typography, Box, Grid, CardHeader, Card, CardContent, Divider, styled, AvatarProps, FormControl, Button, TextField, InputAdornment, CircularProgress, Tabs, TableContainer,Table,TableBody,TableCell,TableHead,TableRow,Paper, tableCellClasses } from '@mui/material';

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
import { putOrganisationLogo } from 'src/store/profile';

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
	width: 50,
	height: 50,
}))

const Profile = () => {

	const [imagePreviewUrl, setImagePreviewUrl] = useState('');
	const [value, setValue] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [employeeData, setemployeeData] = useState<any>('')

	const ability = useContext(AbilityContext)
	const dispatch = useDispatch<AppDispatch>()
	const userData = localStorage.getItem("userData")
	const getTabList = ['Profile Detail', 'Direct Reports', 'Team']

	interface TabPanelProps {
		children?: React.ReactNode;
		index: number;
		value: number;
	}

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
						<Typography>{children}</Typography>
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

	let profileData;
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

	const handleOnChange = async (event: any) => {
		event.preventDefault();

		const reader = new FileReader();
		const file = event.target.files[0];

		reader.onloadend = (e: any) => {
			let image = e.target.result
			setImagePreviewUrl(image);
		};
		reader.readAsDataURL(file);
		await dispatch(putOrganisationLogo(file))
	}

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
		  backgroundColor: '#2dcca7',
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
			<Grid item xs={12}>
				<Card>
					<CardHeader title='Your Profile Details' subheader={<Divider></Divider>} />
					<Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
						{getTabList && getTabList.map((data: string, i: any) =>
							<Tab label={data} key={i} {...a11yProps(i)} />
						)}
					</Tabs>
					<TabPanel value={value} index={0}>
						<CardContent>
							<Grid container spacing={5}>
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
										defaultValue={profileData?.fullName}
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
										defaultValue={profileData?.email}
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
							<Box sx={{  width: '100%' }}>
							<TableContainer component={Paper}>
								<Table sx={{ minWidth: 650 }} aria-label="simple table">
									<TableHead>
									<TableRow >
										<StyledTableCell>Full Name</StyledTableCell>
										<StyledTableCell align="right">Department</StyledTableCell>
									</TableRow>
									</TableHead>
									<TableBody>
									{employeeData && employeeData.directReports.map((row:any,i:number) => (
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
										defaultValue={employeeData && employeeData.team.managerName}
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
										defaultValue={employeeData && employeeData.team.department}
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
				</Card>
			</Grid>
			{ability?.can('read', 'analytics') ? (
				<Grid item xs={12} >
					<Card>
						<CardHeader title='Upload your organisation logo ' subheader={<Divider></Divider>}></CardHeader>
						<CardContent sx={{ m: 3, p: 3 }} >
							<Box sx={{ width: '100%' }}>
								{imagePreviewUrl ? <Avatar src={imagePreviewUrl} skin='light' variant='rounded' sx={{ width: 100, height: 100 }} /> : null}
							</Box>
						</CardContent>

						<Typography variant='body1' component='p' sx={{ ml: 3, pl: 3, pb: 2, fontSize: '12px' }}>
							The size of the Organisation logo should be 500*500.
						</Typography>
						<Box sx={{ ml: 3, pl: 3, pb: 4 }} className="btndivider">
							<Button variant="contained" component="label">
								Upload Organisation Logo
								<input style={{ marginLeft: 60 }} type={"file"} id={"logo"} onChange={handleOnChange} hidden />
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
