// ** React Imports
import React, { SyntheticEvent, useContext, useState } from 'react';

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** MUI Imports
import { Typography, Box, Grid, CardHeader, Card, CardContent, Divider,styled ,AvatarProps, FormControl, Button, TextField, InputAdornment, CircularProgress, Tabs} from '@mui/material';

// ** Custom Components Imports
import CustomAvatar from 'src/@core/components/mui/avatar'

// ** Axios Imports
import axios, { AxiosError } from 'axios';

// ** Auth Import
import { useAuth } from 'src/hooks/useAuth';

//  ** MUI Icon Import
import Tab from '@mui/material/Tab'
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import BusinessIcon from '@mui/icons-material/Business';

// ** Styled Avatar component
const Avatar = styled(CustomAvatar)<AvatarProps>(({ theme }) => ({
	width: 50,
	height: 50,
}))

const Profile = () => {

	const [imagePreviewUrl,setImagePreviewUrl] = useState('');
	const [value, setValue] = useState<number>(0)
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const ability = useContext(AbilityContext)
	const userData = localStorage.getItem("userData")
	const token = localStorage.getItem("accessToken")
	const { logout } = useAuth();

	const getTabList =['Profile Detail','Direct Reports','Team']

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
		console.log(newValue,"dddd")
		setValue(newValue)
	  }

	var data;
	if (userData != null) {
		data = JSON.parse(userData)
	}

	const handleOnChange = async(event: any) => {
		event.preventDefault();

		let reader = new FileReader();
		let file = event.target.files[0];
		
		  reader.onloadend = (e:any) => {
			let image = e.target.result
			setImagePreviewUrl(image);
		  };
		  reader.readAsDataURL(file);

		await axios.put('endpoint',
		{file}, 
		{
			headers: { 'Authorization': `Bearer ${token}` }
        }).then((res)=>{

		}).catch((reason: AxiosError) =>{
			if (reason.response!.status === 401) {
			logout()
		  } else {
			setIsLoading(false);
			// Handle else
		  }
		});
		}

		if (isLoading)
		return (<CircularProgress color="success" />)

	return (<>
			<Card>
			{ability?.can('read', 'analytics') ? (
			<>
				<CardHeader title='To upload a organisation logo please click on the Upload Organisation Logo' subheader={<Divider></Divider>}></CardHeader>
				<CardContent sx={{m:3 , p:3}} >
					<Box sx={{  width: '100%' }}>
					{imagePreviewUrl ? <Avatar src={imagePreviewUrl}  skin='light' variant='rounded' sx={{ width: 100, height: 100 }} />:null}
					</Box>
				</CardContent>

				<Typography variant='body1' component='p' sx={{ ml: 3, pl: 3,pb:2,fontSize:'12px'}}>
					The size of the Organisation logo should be 500*500. 
				</Typography>
				<Box sx={{ ml: 3, pl: 3,pb:4 }} className="btndivider">
					<Button variant="contained" component="label">
						Upload Organisation Logo
						<input style={{ marginLeft: 60 }} type={"file"} id={"logo"} onChange={handleOnChange}  hidden />
					</Button>

				</Box>
			</>
			) : ( 
			<>
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
							defaultValue={data?.companyname} 
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
							type='string'
							label='Full Name'
							name='Full Name'
							defaultValue={data?.fullName} 
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
							type='string'
							label='Organisation Name'
							name='Organisation Name'
							defaultValue={data?.companyname} 
							InputProps={{
								readOnly: true,
								startAdornment: (
								<InputAdornment position='start'>
									<BusinessIcon/>
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
							defaultValue={data?.email} 
							InputProps={{
								readOnly: true,
								startAdornment: (
								<InputAdornment position='start'>
									<MailOutlineIcon/>
								</InputAdornment>
								)
							}}
							/>
						</Grid>
					</Grid>
				</CardContent>
				</TabPanel> 	
				<TabPanel value={value} index={1}>
					<Typography>Coming Soon {getTabList[1]}</Typography>
				</TabPanel>
				<TabPanel value={value} index={2}>
					<Typography>Coming Soon {getTabList[2]}</Typography>
				</TabPanel>
				</>
			)} 
			</Card> 

	</>
	);
}

Profile.acl = {
	action: 'read',
	subject: 'profile'
}


export default Profile;